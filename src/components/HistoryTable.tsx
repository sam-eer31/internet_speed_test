"use client";

import { motion } from "framer-motion";
import { Clock, Trash2, Download, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { SpeedTestResult } from "@/types";
import { clearHistory, getQualityColor } from "@/lib/utils";

interface HistoryTableProps {
  history: SpeedTestResult[];
  onClear: () => void;
}

export function HistoryTable({ history, onClear }: HistoryTableProps) {
  if (history.length === 0) {
    return (
      <motion.div
        className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">No test history yet</p>
        <p className="text-white/25 text-xs mt-1">Run a speed test to see results here</p>
      </motion.div>
    );
  }

  const handleExport = () => {
    const csv = [
      "Date,Download (Mbps),Upload (Mbps),Score,Rating",
      ...history.map(
        (r) =>
          `${new Date(r.timestamp).toLocaleString()},${r.download.toFixed(2)},${r.upload.toFixed(2)},${r.qualityScore},${r.qualityRating}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speedtest-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white/80 font-semibold text-lg">Test History</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-all"
            aria-label="Download results as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-all"
            aria-label="Clear test history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs text-white/40 font-medium pb-3 pr-4">Date</th>
              <th className="text-right text-xs text-white/40 font-medium pb-3 px-3">
                <ArrowDownCircle className="w-3.5 h-3.5 inline" /> Down
              </th>
              <th className="text-right text-xs text-white/40 font-medium pb-3 px-3">
                <ArrowUpCircle className="w-3.5 h-3.5 inline" /> Up
              </th>
              <th className="text-right text-xs text-white/40 font-medium pb-3 px-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 10).map((result, idx) => (
              <motion.tr
                key={result.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="py-3 pr-4 text-sm text-white/60">
                  {new Date(result.timestamp).toLocaleDateString()}{" "}
                  <span className="text-white/30">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </td>

                <td className="py-3 px-3 text-right text-sm text-blue-400 tabular-nums">
                  {result.download.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right text-sm text-emerald-400 tabular-nums">
                  {result.upload.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium tabular-nums"
                    style={{
                      backgroundColor: `${getQualityColor(result.qualityRating)}20`,
                      color: getQualityColor(result.qualityRating),
                    }}
                  >
                    {result.qualityScore}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
