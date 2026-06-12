"use client";

import { motion } from "framer-motion";
import { QualityRating } from "@/types";
import { getQualityColor } from "@/lib/utils";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Shield } from "lucide-react";

interface QualityScoreProps {
  score: number;
  rating: QualityRating;
}

export function QualityScore({ score, rating }: QualityScoreProps) {
  const animatedScore = useAnimatedCounter(score, 1500, 0);
  const color = getQualityColor(rating);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 animate-pulse" style={{ color }} />
        <h3 className="font-bold uppercase tracking-wider text-xs" style={{ color: "var(--text-secondary)" }}>Connection Quality</h3>
      </div>

      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--ring-bg)"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {Math.round(animatedScore)}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>/ 100</span>
        </div>
      </div>

      <motion.span
        className="px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: `${color}20`, color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {rating}
      </motion.span>
    </motion.div>
  );
}
