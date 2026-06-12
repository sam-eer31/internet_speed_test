"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
import { SpeedTestResult } from "@/types";
import { getQualityColor } from "@/lib/utils";

interface ShareCardProps {
  result: SpeedTestResult;
  unit: "bit" | "byte";
}

export function ShareCard({ result, unit }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadVal = unit === "byte" ? result.download / 8 : result.download;
  const uploadVal = unit === "byte" ? result.upload / 8 : result.upload;
  const unitStr = unit === "byte" ? "MB/s" : "Mbps";

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#0a0a1a",
      });
      const link = document.createElement("a");
      link.download = `speedtest-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    }
  }, []);

  const handleShare = useCallback(async () => {
    const text = `My Speed Test Results:\nDownload: ${downloadVal.toFixed(2)} ${unitStr}\nUpload: ${uploadVal.toFixed(2)} ${unitStr}\nPing: ${result.ping.toFixed(1)} ms\nJitter: ${result.jitter.toFixed(1)} ms\nQuality: ${result.qualityRating} (${result.qualityScore}/100)`;

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
        className="w-full max-w-md bg-gradient-to-br from-[#0a0a1a] to-[#111133] rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">ST</span>
            </div>
            <span className="text-white font-bold">SpeedTest</span>
          </div>
          <span className="text-white/40 text-xs">
            {new Date(result.timestamp).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.04] rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Download</p>
            <p className="text-2xl font-bold text-blue-400">
              {downloadVal.toFixed(2)}
            </p>
            <p className="text-white/30 text-xs">{unitStr}</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Upload</p>
            <p className="text-2xl font-bold text-emerald-400">
              {uploadVal.toFixed(2)}
            </p>
            <p className="text-white/30 text-xs">{unitStr}</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Ping</p>
            <p className="text-2xl font-bold text-purple-400">
              {result.ping.toFixed(1)}
            </p>
            <p className="text-white/30 text-xs">ms</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Jitter</p>
            <p className="text-2xl font-bold text-amber-400">
              {result.jitter.toFixed(1)}
            </p>
            <p className="text-white/30 text-xs">ms</p>
          </div>

        </div>

        <div className="flex items-center justify-between bg-white/[0.04] rounded-xl p-4">
          <div>
            <p className="text-white/40 text-xs">Quality Score</p>
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
          className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl text-white/80 text-sm transition-all hover:border-white/[0.15]"
          aria-label="Download results as PNG"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm transition-all"
          aria-label="Share results"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </motion.div>
  );
}
