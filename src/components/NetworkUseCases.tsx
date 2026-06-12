"use client";

import { SpeedTestResult } from "@/types";
import { Gamepad2, Video, Globe, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

interface NetworkUseCasesProps {
  result: SpeedTestResult;
}

export function NetworkUseCases({ result }: NetworkUseCasesProps) {
  const { ping, download, upload, jitter } = result;

  // Compute ratings
  const getGamingRating = () => {
    if (ping < 30 && jitter < 5) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (ping < 60 && jitter < 15) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (ping < 100 && jitter < 30) return { label: "Average", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Poor", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const getVideoRating = () => {
    if (download > 15 && upload > 5 && ping < 60) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (download > 5 && upload > 2 && ping < 100) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (download > 2 && upload > 1 && ping < 200) return { label: "Average", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Poor", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const getStreamingRating = () => {
    if (download > 50) return { label: "Excellent (4K)", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (download > 15) return { label: "Good (HD)", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (download > 5) return { label: "Average (SD)", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Poor", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const getBrowsingRating = () => {
    if (download > 15 && ping < 50) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (download > 5 && ping < 100) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (download > 2 && ping < 200) return { label: "Average", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Poor", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const cases = [
    { name: "Online Gaming", icon: Gamepad2, rating: getGamingRating() },
    { name: "Video Calls", icon: Video, rating: getVideoRating() },
    { name: "Streaming", icon: PlaySquare, rating: getStreamingRating() },
    { name: "Browsing", icon: Globe, rating: getBrowsingRating() },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cases.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          className="glass-panel p-5 flex flex-col items-center justify-center text-center gap-2 rounded-2xl hover:bg-white/5 transition-colors duration-300"
        >
          <div className={`p-3 rounded-full ${c.rating.bg}`}>
            <c.icon className={`w-6 h-6 ${c.rating.color}`} />
          </div>
          <span className="font-semibold text-[var(--text-primary)] tracking-wide">{c.name}</span>
          <span className={`text-sm font-black tracking-widest uppercase ${c.rating.color}`}>
            {c.rating.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
