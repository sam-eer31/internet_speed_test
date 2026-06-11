import { QualityRating, SpeedTestResult } from "@/types";

export function calculateQualityScore(
  ping: number,
  download: number,
  upload: number,
  jitter: number
): number {
  const pingScore = Math.max(0, Math.min(100, 100 - ping * 1.5));
  const jitterScore = Math.max(0, Math.min(100, 100 - jitter * 5));
  const downloadScore = Math.min(100, (download / 100) * 100);
  const uploadScore = Math.min(100, (upload / 50) * 100);

  const score = Math.round(
    pingScore * 0.2 + jitterScore * 0.1 + downloadScore * 0.45 + uploadScore * 0.25
  );
  return Math.max(0, Math.min(100, score));
}

export function getQualityRating(score: number): QualityRating {
  if (score >= 85) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 40) return "Average";
  return "Poor";
}

export function getQualityColor(rating: QualityRating): string {
  switch (rating) {
    case "Excellent":
      return "#10b981";
    case "Good":
      return "#3b82f6";
    case "Average":
      return "#f59e0b";
    case "Poor":
      return "#ef4444";
  }
}

export function formatMbps(mbps: number): string {
  if (mbps >= 1000) return (mbps / 1000).toFixed(2) + " Gbps";
  return mbps.toFixed(2) + " Mbps";
}

export function formatMs(ms: number): string {
  return ms.toFixed(1) + " ms";
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getHistory(): SpeedTestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("speedtest-history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: SpeedTestResult): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    history.unshift(result);
    const trimmed = history.slice(0, 50);
    localStorage.setItem("speedtest-history", JSON.stringify(trimmed));
  } catch {
    // storage full or unavailable
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("speedtest-history");
}

export function detectBrowser(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown";
}

export function detectDeviceInfo() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return {
      browser: "Unknown",
      platform: "Unknown",
      screenResolution: "Unknown",
      deviceMemory: "Unknown",
      cpuCores: "Unknown",
      userAgent: "Unknown",
      connectionType: "Unknown",
    };
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; type?: string };
  };

  return {
    browser: detectBrowser(),
    platform: nav.platform || "Unknown",
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "Not available",
    cpuCores: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} cores` : "Not available",
    userAgent: nav.userAgent,
    connectionType: nav.connection?.effectiveType || nav.connection?.type || "Not available",
  };
}
