"use client";

import { motion } from "framer-motion";
import { TestPhase } from "@/types";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

interface ProgressStepsProps {
  phase: TestPhase;
  progress: number;
}

const phases: { key: TestPhase; label: string }[] = [
  { key: "download", label: "Download" },
  { key: "upload", label: "Upload" },
];

const phaseOrder = ["idle", "download", "upload", "complete"];

export function ProgressSteps({ phase, progress }: ProgressStepsProps) {
  const currentIdx = phaseOrder.indexOf(phase);

  return (
    <motion.div
      className="flex items-center justify-center gap-2 sm:gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {phases.map((p, idx) => {
        const phaseIdx = phaseOrder.indexOf(p.key);
        const isComplete = currentIdx > phaseIdx;
        const isActive = phase === p.key;
        const isPending = currentIdx < phaseIdx;

        return (
          <div key={p.key} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </motion.div>
              ) : isActive ? (
                <div className="relative">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-white/20" />
              )}
              <span
                className={`text-sm font-medium ${
                  isComplete
                    ? "text-emerald-400"
                    : isActive
                    ? "text-white"
                    : "text-white/30"
                }`}
              >
                {p.label}
              </span>
            </div>

            {isActive && (
              <div className="hidden sm:block w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {idx < phases.length - 1 && (
              <div
                className={`w-8 h-px ${
                  isComplete ? "bg-emerald-400/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
