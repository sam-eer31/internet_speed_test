"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { SpeedTestResult } from "@/types";
import { useTheme } from "@/components/ThemeProvider";

interface LiveChartProps {
  history: SpeedTestResult[];
}

export function LiveChart({ history }: LiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setVisible(true);
      } else {
        requestAnimationFrame(check);
      }
    };

    requestAnimationFrame(check);
    return () => {
      cancelled = true;
    };
  }, []);

  const data = [...history]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-15) // Show only the last 15 tests to keep the graph readable
    .map((h) => {
      const d = new Date(h.timestamp);
      return {
        name: `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`,
        download: Number(h.download.toFixed(2)),
        upload: Number(h.upload.toFixed(2)),
      };
    });

  if (data.length < 2) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold uppercase tracking-wider text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
        Speed Over Time (Mbps)
      </h3>
      <div ref={containerRef} className="h-64 w-full">
        {visible ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
                fontSize={10}
                fontWeight="500"
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
                fontSize={10}
                fontWeight="500"
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "rgba(6,8,13,0.95)" : "rgba(255,255,255,0.97)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  borderRadius: "12px",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  fontSize: 11,
                  boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.5)" : "0 10px 25px rgba(0,0,0,0.08)",
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)",
                  fontSize: 11,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              />
              <Line
                type="monotone"
                dataKey="download"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: "rgba(59,130,246,0.3)", strokeWidth: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: "#10b981", r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: "rgba(16,185,129,0.3)", strokeWidth: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="shimmer h-full w-full rounded-xl" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
