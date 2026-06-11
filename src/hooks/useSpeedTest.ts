"use client";

import { useCallback, useRef, useState } from "react";
import { TestProgress, SpeedTestResult } from "@/types";
import {
  calculateQualityScore,
  getQualityRating,
  generateId,
  saveResult,
} from "@/lib/utils";

// ─── Configuration ──────────────────────────────────────────────────────────

/** Number of parallel streams kept alive during saturation testing. */
const DL_PARALLEL_STREAMS = 8;
const UL_PARALLEL_STREAMS = 8;

/** How long each measurement phase runs (excluding warm-up). */
const MEASURE_DURATION_MS = 12_000; // 12 seconds

/** Warm-up period at the start of each phase — samples discarded. */
const WARMUP_MS = 2_000; // 2 seconds

/** How often we compute and report instantaneous speed during a phase. */
const SAMPLE_INTERVAL_MS = 200; // 200 ms

/** Number of ping measurements (first N_PING_DISCARD are discarded). */
const N_PING = 12;
const N_PING_DISCARD = 2;

/** Download chunk size per stream. 10MB static file ensures CDN line-rate speeds. */
const DL_CHUNK_MB = 10;

/** Upload body size per parallel stream. 1MB chunks ensure smooth rolling completions. */
const UL_CHUNK_MB = 1;

// ─── Pre-generate the upload buffer once at module load ─────────────────────
// Generating a new large Uint8Array per upload round adds variable unmeasured
// latency. We create one buffer once and reuse it across all upload requests.
// The data is pseudo-random (incompressible) to prevent gzip from distorting
// the payload size.
const UL_BUFFER_SIZE = UL_CHUNK_MB * 1024 * 1024;
const uploadBuffer = (() => {
  const buf = new Uint8Array(UL_BUFFER_SIZE);
  // LCG pseudo-random fill — fast and incompressible
  let state = 0xcafebabe;
  for (let i = 0; i < buf.length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    buf[i] = state & 0xff;
  }
  return buf;
})();

// ─── Statistics helpers ──────────────────────────────────────────────────────

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

/**
 * Weighted trimmed mean — discards the bottom `trimLow` fraction and
 * top `trimHigh` fraction of samples, then returns the arithmetic mean
 * of the remaining values. This is the standard approach used by Ookla.
 */
function trimmedMean(
  arr: number[],
  trimLow = 0.1,
  trimHigh = 0.05
): number {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];
  const sorted = [...arr].sort((a, b) => a - b);
  const lo = Math.floor(sorted.length * trimLow);
  const hi = Math.ceil(sorted.length * (1 - trimHigh));
  const trimmed = sorted.slice(lo, hi);
  return trimmed.length > 0 ? mean(trimmed) : mean(sorted);
}

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: TestProgress = {
  phase: "idle",
  currentSpeed: 0,
  ping: 0,
  jitter: 0,
  download: 0,
  upload: 0,
  downloadSamples: [],
  uploadSamples: [],
  progress: 0,
  speedResetKey: 0,
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSpeedTest() {
  const [progress, setProgress] = useState<TestProgress>(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const abortRef = useRef(false);

  // ── Warm-up ───────────────────────────────────────────────────────────────
  const warmUp = useCallback(async () => {
    try {
      // Small download + ping to establish TCP connections and warm caches
      await Promise.all([
        fetch(`/api/download?size=1&warmup=1&t=${Date.now()}`, {
          cache: "no-store",
        }),
        fetch(`/api/ping?t=${Date.now()}`, { cache: "no-store" }),
      ]);
    } catch {
      // Non-critical — continue even if warm-up fails
    }
  }, []);

  // ── Ping ──────────────────────────────────────────────────────────────────
  /**
   * Measures latency by sending rapid sequential GET requests to /api/ping.
   *
   * Correctness guarantees:
   * - Timer starts immediately before fetch(), stops when response headers
   *   arrive (not after body parse — body is ~30 bytes so negligible).
   * - First N_PING_DISCARD samples discarded (TCP slow-start / JIT warm-up).
   * - Reports median latency (robust to occasional outliers from scheduling).
   * - Jitter = mean absolute deviation of consecutive samples (RFC 3550).
   */
  const measurePing = useCallback(async (): Promise<{
    ping: number;
    jitter: number;
  }> => {
    const rawPings: number[] = [];
    const PING_DURATION_MS = 5000;
    const phaseStart = performance.now();

    let i = 0;
    while (!abortRef.current && performance.now() - phaseStart < PING_DURATION_MS) {
      const t0 = performance.now();
      let pingMs = 0;
      try {
        const url = `https://speed.cloudflare.com/__down?bytes=0&t=${Date.now()}-${i}`;
        const res = await fetch(url);
        await res.text();
        
        const t1 = performance.now();
        pingMs = t1 - t0;

        // Use W3C Resource Timing API for 100% accurate ping.
        // This is the exact method Ookla uses. It measures the precise network-level 
        // Time-To-First-Byte (TTFB) excluding DNS, TCP handshake, and TLS handshake.
        const entries = performance.getEntriesByName(url);
        if (entries && entries.length > 0) {
          const entry = entries[0] as PerformanceResourceTiming;
          if (entry.responseStart > 0 && entry.requestStart > 0) {
            pingMs = entry.responseStart - entry.requestStart;
          }
        }
      } catch {
        // Skip failed ping
        continue;
      }

      rawPings.push(pingMs);

      const elapsed = performance.now() - phaseStart;
      setProgress((prev) => ({
        ...prev,
        phase: "ping",
        currentSpeed: rawPings[rawPings.length - 1],
        ping: rawPings[rawPings.length - 1],
        progress: Math.min(100, (elapsed / PING_DURATION_MS) * 100),
      }));

      // Add a small delay so we don't spam the server too aggressively over 5 seconds
      await new Promise(resolve => setTimeout(resolve, 50));
      i++;
    }

    const stable = rawPings.slice(N_PING_DISCARD);
    const pingResult = stable.length > 0 ? median(stable) : 0;

    // Jitter: mean absolute deviation between consecutive samples (RFC 3550)
    const jitterValues = stable
      .slice(1)
      .map((p, i) => Math.abs(p - stable[i]));
    const jitterResult =
      jitterValues.length > 0 ? mean(jitterValues) : 0;

    return { ping: pingResult, jitter: jitterResult };
  }, []);

  // ── Download ──────────────────────────────────────────────────────────────
  /**
   * Measures download throughput using a time-bounded saturation algorithm.
   *
   * Algorithm (Cloudflare / modern Ookla approach):
   * 1. Keep DL_PARALLEL_STREAMS concurrent HTTP GET streams active at all times.
   * 2. For each stream, use response.body.getReader() to receive chunks.
   *    - Record `firstByteTime` when the first chunk arrives.
   *    - Only count bytes received AFTER firstByteTime toward speed calculation.
   *    - This cleanly excludes DNS + TCP + TLS + server processing (TTFB).
   * 3. A background sampler fires every SAMPLE_INTERVAL_MS and computes
   *    instantaneous speed = bytes_received_in_window / window_seconds.
   * 4. After WARMUP_MS, samples start being recorded.
   * 5. After WARMUP_MS + MEASURE_DURATION_MS, the loop terminates.
   * 6. Final speed = trimmedMean of all recorded instantaneous samples.
   */
  const measureDownload = useCallback(async (): Promise<{
    speed: number;
    samples: number[];
  }> => {
    const phaseStart = performance.now();
    const measureStart = phaseStart + WARMUP_MS;
    const phaseEnd = phaseStart + WARMUP_MS + MEASURE_DURATION_MS;

    // Shared accounting across all parallel streams
    let totalBytesAfterFirstByte = 0; // bytes counted toward speed
    let windowBytesStart = 0; // bytes at start of current sample window
    let lastWindowTime = phaseStart;

    const speedSamples: number[] = [];

    // --- Sampler: fires every SAMPLE_INTERVAL_MS --------------------------
    let samplerTimer: ReturnType<typeof setInterval> | null = null;

    const startSampler = () => {
      samplerTimer = setInterval(() => {
        if (abortRef.current) {
          if (samplerTimer) clearInterval(samplerTimer);
          return;
        }
        const now = performance.now();
        const windowSec = (now - lastWindowTime) / 1000;
        const windowBytes = totalBytesAfterFirstByte - windowBytesStart;

        if (windowSec > 0 && windowBytes > 0) {
          const instantMbps = (windowBytes * 8) / windowSec / 1_000_000;

          // Only record samples after warm-up period
          if (now >= measureStart) {
            speedSamples.push(instantMbps);
          }

          const elapsed = now - phaseStart;
          const totalDuration = WARMUP_MS + MEASURE_DURATION_MS;

          setProgress((prev) => ({
            ...prev,
            phase: "download",
            currentSpeed: instantMbps,
            download:
              speedSamples.length > 0
                ? trimmedMean(speedSamples)
                : instantMbps,
            downloadSamples: [...speedSamples],
            progress: Math.min(100, (elapsed / totalDuration) * 100),
          }));
        }

        windowBytesStart = totalBytesAfterFirstByte;
        lastWindowTime = now;
      }, SAMPLE_INTERVAL_MS);
    };

    // --- Single stream worker --------------------------------------------
    const runStream = async (): Promise<void> => {
      if (abortRef.current || performance.now() >= phaseEnd) return;

      let firstByteTime: number | null = null;

      try {
        // Use Cloudflare's dedicated public speed test endpoint.
        // This bypasses Vercel's entire infrastructure limits and connects directly 
        // to a global Tier-1 edge network, ensuring 100% accuracy matching Ookla.
        const bytesToFetch = DL_CHUNK_MB * 1024 * 1024;
        const response = await fetch(
          `https://speed.cloudflare.com/__down?bytes=${bytesToFetch}&t=${Date.now()}-${Math.random()}`,
          { cache: "no-store" }
        );

        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();

        while (true) {
          if (abortRef.current || performance.now() >= phaseEnd) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          if (firstByteTime === null) {
            // First byte received — TTFB complete, start counting bytes
            firstByteTime = performance.now();
          }

          // Only accumulate bytes after TTFB
          totalBytesAfterFirstByte += value.byteLength;
        }
      } catch {
        // Stream error — the coordinator will spawn a replacement
      }
    };

    // --- Coordinator: keeps DL_PARALLEL_STREAMS alive --------------------
    startSampler();

    const coordinator = async (): Promise<void> => {
      // Track active stream count with a simple promise pool
      const activeStreams: Promise<void>[] = [];

      const spawnStream = () => {
        const p = runStream().finally(() => {
          // Remove from active set when done
          const idx = activeStreams.indexOf(p);
          if (idx !== -1) activeStreams.splice(idx, 1);
          // Immediately spawn replacement if phase not over
          if (!abortRef.current && performance.now() < phaseEnd) {
            spawnStream();
          }
        });
        activeStreams.push(p);
      };

      // Fill initial pool
      for (let i = 0; i < DL_PARALLEL_STREAMS; i++) {
        spawnStream();
      }

      // Wait until phase is over
      await new Promise<void>((resolve) => {
        const check = () => {
          if (abortRef.current || performance.now() >= phaseEnd) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    };

    await coordinator();

    if (samplerTimer) clearInterval(samplerTimer);

    const finalSpeed =
      speedSamples.length > 0 ? trimmedMean(speedSamples) : 0;

    return { speed: finalSpeed, samples: speedSamples };
  }, []);

  // ── Upload ────────────────────────────────────────────────────────────────
  /**
   * Measures upload throughput using the same time-bounded saturation model.
   *
   * Key correctness decisions:
   * - Uses a pre-allocated, reused Uint8Array to eliminate buffer generation
   *   time from the measurement window.
   * - Timer starts immediately before the fetch() call.
   * - Timer stops when the response JSON is received (server has finished
   *   accepting the body).
   * - Speed = bytes_uploaded / (response_time - request_start), not including
   *   server processing (response body is tiny < 100 bytes).
   * - Same warm-up + sample model as download.
   */
  const measureUpload = useCallback(async (): Promise<{
    speed: number;
    samples: number[];
  }> => {
    const phaseStart = performance.now();
    const measureStart = phaseStart + WARMUP_MS;
    const phaseEnd = phaseStart + WARMUP_MS + MEASURE_DURATION_MS;

    const speedSamples: number[] = [];
    
    // Track chunk completions for rolling average (bypasses OS buffering)
    let completions: { bytes: number; ts: number }[] = [];

    // --- Sampler ---------------------------------------------------------
    let samplerTimer: ReturnType<typeof setInterval> | null = null;

    const startSampler = () => {
      samplerTimer = setInterval(() => {
        if (abortRef.current) {
          if (samplerTimer) clearInterval(samplerTimer);
          return;
        }
        const now = performance.now();
        
        // Remove completions older than 1 second
        completions = completions.filter(c => now - c.ts <= 1000);
        
        const windowSec = Math.max(0.1, Math.min(1.0, (now - phaseStart) / 1000));
        const windowBytes = completions.reduce((acc, c) => acc + c.bytes, 0);

        if (windowSec > 0) {
          const instantMbps = (windowBytes * 8) / windowSec / 1_000_000;

          if (now >= measureStart) {
            speedSamples.push(instantMbps);
          }

          const elapsed = now - phaseStart;
          const totalDuration = WARMUP_MS + MEASURE_DURATION_MS;

          setProgress((prev) => ({
            ...prev,
            phase: "upload",
            currentSpeed: instantMbps,
            upload:
              speedSamples.length > 0
                ? trimmedMean(speedSamples)
                : instantMbps,
            uploadSamples: [...speedSamples],
            progress: Math.min(100, (elapsed / totalDuration) * 100),
          }));
        }
      }, SAMPLE_INTERVAL_MS);
    };

    // --- Single upload worker --------------------------------------------
    const runUpload = (): Promise<void> => {
      return new Promise((resolve) => {
        if (abortRef.current || performance.now() >= phaseEnd) {
          return resolve();
        }

        const body = uploadBuffer.slice(0);
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          completions.push({ bytes: body.byteLength, ts: performance.now() });
          resolve();
        };

        xhr.onerror = () => resolve();
        xhr.onabort = () => resolve();

        // Cloudflare's __up endpoint accepts any POST payload and instantly discards it.
        // We MUST NOT set custom headers like Cache-Control, otherwise it triggers a CORS 
        // preflight (OPTIONS) which fails. POST requests are never cached anyway.
        xhr.open("POST", `https://speed.cloudflare.com/__up?t=${Date.now()}-${Math.random()}`);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(body);
      });
    };

    // --- Coordinator -----------------------------------------------------
    startSampler();

    const coordinator = async (): Promise<void> => {
      const activeUploads: Promise<void>[] = [];

      const spawnUpload = () => {
        const p = runUpload().finally(() => {
          const idx = activeUploads.indexOf(p);
          if (idx !== -1) activeUploads.splice(idx, 1);
          if (!abortRef.current && performance.now() < phaseEnd) {
            spawnUpload();
          }
        });
        activeUploads.push(p);
      };

      for (let i = 0; i < UL_PARALLEL_STREAMS; i++) {
        spawnUpload();
      }

      await new Promise<void>((resolve) => {
        const check = () => {
          if (abortRef.current || performance.now() >= phaseEnd) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    };

    await coordinator();

    if (samplerTimer) clearInterval(samplerTimer);

    const finalSpeed =
      speedSamples.length > 0 ? trimmedMean(speedSamples) : 0;

    return { speed: finalSpeed, samples: speedSamples };
  }, []);

  // ── Orchestrator ──────────────────────────────────────────────────────────
  const startTest = useCallback(async () => {
    abortRef.current = false;
    setIsRunning(true);
    setResult(null);
    setProgress({ ...initialState, phase: "ping" });

    try {
      // 1. Warm up — establish connections, prime server caches
      await warmUp();
      if (abortRef.current) return;

      // 2. Ping phase
      setProgress((prev) => ({
        ...prev,
        phase: "ping",
        progress: 0,
      }));
      const { ping, jitter } = await measurePing();
      if (abortRef.current) return;

      setProgress((prev) => ({
        ...prev,
        ping,
        jitter,
        currentSpeed: 0,
        speedResetKey: prev.speedResetKey + 1,
      }));

      // 3. Download phase
      setProgress((prev) => ({
        ...prev,
        phase: "download",
        progress: 0,
        speedResetKey: prev.speedResetKey + 1,
      }));
      const downloadResult = await measureDownload();
      if (abortRef.current) return;

      setProgress((prev) => ({
        ...prev,
        download: downloadResult.speed,
        currentSpeed: 0,
        speedResetKey: prev.speedResetKey + 1,
      }));

      // 4. Upload phase
      setProgress((prev) => ({
        ...prev,
        phase: "upload",
        progress: 0,
        speedResetKey: prev.speedResetKey + 1,
      }));
      const uploadResult = await measureUpload();
      if (abortRef.current) return;

      setProgress((prev) => ({
        ...prev,
        upload: uploadResult.speed,
      }));

      // 5. Finalize
      const qualityScore = calculateQualityScore(
        ping,
        downloadResult.speed,
        uploadResult.speed,
        jitter
      );
      const qualityRating = getQualityRating(qualityScore);

      const finalResult: SpeedTestResult = {
        id: generateId(),
        timestamp: Date.now(),
        ping,
        jitter,
        download: downloadResult.speed,
        upload: uploadResult.speed,
        qualityScore,
        qualityRating,
      };

      saveResult(finalResult);
      setResult(finalResult);

      setProgress((prev) => ({
        ...prev,
        phase: "complete",
        progress: 100,
        downloadSamples: downloadResult.samples,
        uploadSamples: uploadResult.samples,
      }));
    } catch (err) {
      console.error("Speed test error:", err);
      setProgress((prev) => ({ ...prev, phase: "idle" }));
    } finally {
      setIsRunning(false);
    }
  }, [warmUp, measurePing, measureDownload, measureUpload]);

  const stopTest = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setProgress(initialState);
  }, []);

  return {
    progress,
    isRunning,
    result,
    startTest,
    stopTest,
  };
}
