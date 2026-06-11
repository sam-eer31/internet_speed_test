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

interface LiveChartProps {
  history: SpeedTestResult[];
}

export function LiveChart({ history }: LiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  if (data.length === 0) return null;

  return (
    <motion.div
      className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-white/80 font-semibold mb-4 text-lg">
        Speed Over Time
      </h3>
      <div ref={containerRef} className="h-64 w-full">
        {visible ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.2)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                fontSize={12}
                tickLine={false}
                label={{
                  value: "Mbps",
                  angle: -90,
                  position: "insideLeft",
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,15,25,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: 13,
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="download"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
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
