"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
import { SpeedTestResult } from "@/types";
import { getQualityColor } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

interface ShareCardProps {
  result: SpeedTestResult;
  unit: "bit" | "byte";
}

export function ShareCard({ result, unit }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const downloadVal = unit === "byte" ? result.download / 8 : result.download;
  const uploadVal = unit === "byte" ? result.upload / 8 : result.upload;
  const unitStr = unit === "byte" ? "MB/s" : "Mbps";

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: resolvedTheme === "dark" ? "#0a0a1a" : "#f0f4f8",
      });
      const link = document.createElement("a");
      link.download = `speedtest-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    }
  }, [resolvedTheme]);

  const handleShare = useCallback(async () => {
    const text = `My Speed Test Results:\nDownload: ${downloadVal.toFixed(2)} ${unitStr}\nUpload: ${uploadVal.toFixed(2)} ${unitStr}\nPing: ${(result.ping ?? 0).toFixed(1)} ms\nJitter: ${(result.jitter ?? 0).toFixed(1)} ms\nQuality: ${result.qualityRating} (${result.qualityScore}/100)`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Speed Test Results", text });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }, [result, downloadVal, uploadVal, unitStr]);

  const color = getQualityColor(result.qualityRating);

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, var(--share-card-from), var(--share-card-to))`,
          border: `1px solid var(--share-card-border)`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>Flynk</span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(result.timestamp).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ background: "var(--share-card-cell-bg)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Download</p>
            <p className="text-2xl font-bold text-blue-400">
              {downloadVal.toFixed(2)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>{unitStr}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--share-card-cell-bg)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Upload</p>
            <p className="text-2xl font-bold text-emerald-400">
              {uploadVal.toFixed(2)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>{unitStr}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--share-card-cell-bg)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Ping</p>
            <p className="text-2xl font-bold text-purple-400">
              {(result.ping ?? 0).toFixed(1)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>ms</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--share-card-cell-bg)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Jitter</p>
            <p className="text-2xl font-bold text-amber-400">
              {(result.jitter ?? 0).toFixed(1)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>ms</p>
          </div>

        </div>

        <div className="flex items-center justify-between rounded-xl p-4" style={{ background: "var(--share-card-cell-bg)" }}>
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Quality Score</p>
            <p className="text-xl font-bold" style={{ color }}>
              {result.qualityScore}/100
            </p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {result.qualityRating}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: "var(--btn-secondary-bg)",
            border: "1px solid var(--btn-secondary-border)",
            color: "var(--text-secondary)",
          }}
          aria-label="Download results as PNG"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/20 rounded-xl text-indigo-400 text-sm transition-all"
          aria-label="Share results"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </motion.div>
  );
}
