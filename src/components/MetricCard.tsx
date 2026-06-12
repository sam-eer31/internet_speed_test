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
      {/* Background soft hover aura */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ backgroundColor: `${color}0c` }}
      />
      <div className="relative glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${color}0f`, border: `1px solid var(--border-secondary)` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-3xl font-extrabold tabular-nums tracking-tight" style={{ color: "var(--text-primary)" }}>
            {animatedValue.toFixed(decimals)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{unit}</span>
        </div>

        <p className="text-xs font-normal leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
    </motion.div>
  );
}
