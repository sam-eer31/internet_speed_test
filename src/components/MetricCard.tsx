"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  description: string;
  color: string;
  delay?: number;
  decimals?: number;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  description,
  color,
  delay = 0,
  decimals = 2,
}: MetricCardProps) {
  const animatedValue = useAnimatedCounter(value, 1200, decimals);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ backgroundColor: `${color}15` }}
      />
      <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="text-white/60 text-sm font-medium">{label}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white tabular-nums">
            {animatedValue.toFixed(decimals)}
          </span>
          <span className="text-white/40 text-sm">{unit}</span>
        </div>

        <p className="text-white/30 text-xs">{description}</p>
      </div>
    </motion.div>
  );
}
