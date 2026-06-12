"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  Waves,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Particles } from "@/components/Particles";
import { SpeedGauge } from "@/components/SpeedGauge";
import { SmoothNumber } from "@/components/SmoothNumber";
import { ProgressSteps } from "@/components/ProgressSteps";
import { MetricCard } from "@/components/MetricCard";
import { QualityScore } from "@/components/QualityScore";
import { LiveChart } from "@/components/LiveChart";
import { DeviceInfo } from "@/components/DeviceInfo";
import { HistoryTable } from "@/components/HistoryTable";
import { ShareCard } from "@/components/ShareCard";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { useSpeedTest } from "@/hooks/useSpeedTest";
import { SpeedTestResult } from "@/types";
import { getHistory, clearHistory } from "@/lib/utils";

export default function Home() {
  const { progress, isRunning, result, startTest, stopTest } = useSpeedTest();
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [unit, setUnit] = useState<"bit" | "byte">("byte");

  useEffect(() => {
    const savedUnit = localStorage.getItem("speedtest-unit");
    if (savedUnit === "bit" || savedUnit === "byte") {
      setUnit(savedUnit);
    }
  }, []);

  const handleUnitChange = (newUnit: "bit" | "byte") => {
    setUnit(newUnit);
    localStorage.setItem("speedtest-unit", newUnit);
  };

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    if (result) {
      setHistory(getHistory());
    }
  }, [result]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const showResults = progress.phase === "complete" && result;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a2e] to-[#050510]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Particles />
      <Navbar unit={unit} onUnitChange={handleUnitChange} />

      <main className="relative z-10 flex-1">
        {/* Hero Section — Gauge & Controls */}
        <section id="home" className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Internet Speed Test
              </h1>
              <p className="text-white/40 text-lg max-w-xl mx-auto">
                Measure your connection with precision. Real-time analytics,
                beautiful visualizations, and comprehensive quality scoring.
              </p>
            </motion.div>

            {/* Gauge */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SpeedGauge
                speed={
                  showResults
                    ? (unit === "byte" ? result.download / 8 : result.download)
                    : (unit === "byte" ? progress.currentSpeed / 8 : progress.currentSpeed)
                }
                phase={progress.phase}
                maxSpeed={progress.phase === "ping" ? 100 : (unit === "byte" ? 125 : 1000)}
                size={380}
                instant={!!showResults}
                resetKey={progress.speedResetKey}
                unit={unit}
              />

              {/* Progress Steps */}
              <AnimatePresence>
                {isRunning && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ProgressSteps
                      phase={progress.phase}
                      progress={progress.progress}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Live stats during test */}
              <AnimatePresence>
                {isRunning && (
                  <motion.div
                    className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {progress.ping > 0 && (
                      <span className="text-white/40">
                        Ping:{" "}
                        <span className="text-purple-400 font-semibold tabular-nums">
                          {progress.ping.toFixed(1)} ms
                        </span>
                      </span>
                    )}
                    {progress.download > 0 && (
                      <span className="text-white/40">
                        Download:{" "}
                        <span className="text-blue-400 tabular-nums">
                          {progress.phase === "download" ? (
                            <SmoothNumber value={unit === "byte" ? progress.currentSpeed / 8 : progress.currentSpeed} />
                          ) : (
                            (unit === "byte" ? progress.download / 8 : progress.download).toFixed(2)
                          )}{" "}
                          {unit === "byte" ? "MB/s" : "Mbps"}
                        </span>
                      </span>
                    )}
                    {progress.upload > 0 && (
                      <span className="text-white/40">
                        Upload:{" "}
                        <span className="text-emerald-400 tabular-nums">
                          {progress.phase === "upload" ? (
                            <SmoothNumber value={unit === "byte" ? progress.currentSpeed / 8 : progress.currentSpeed} />
                          ) : (
                            (unit === "byte" ? progress.upload / 8 : progress.upload).toFixed(2)
                          )}{" "}
                          {unit === "byte" ? "MB/s" : "Mbps"}
                        </span>
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.div className="mt-8 flex gap-3">
                {!isRunning ? (
                  <motion.button
                    onClick={startTest}
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Start speed test"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.3)]" />
                    <span className="relative flex items-center gap-2.5 text-lg">
                      <Play className="w-5 h-5" />
                      {showResults ? "Test Again" : "Start Speed Test"}
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={stopTest}
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    aria-label="Stop speed test"
                  >
                    <div className="absolute inset-0 bg-red-600/80 rounded-2xl" />
                    <span className="relative flex items-center gap-2.5 text-lg">
                      <Square className="w-5 h-5" />
                      Stop Test
                    </span>
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Results Section — always below gauge */}
        <AnimatePresence>
          {showResults && (
            <section className="pb-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      icon={Activity}
                      label="Ping"
                      value={result.ping}
                      unit="ms"
                      description="Network latency"
                      color="#8b5cf6"
                      delay={0}
                      decimals={1}
                    />
                    <MetricCard
                      icon={ArrowDownCircle}
                      label="Download"
                      value={unit === "byte" ? result.download / 8 : result.download}
                      unit={unit === "byte" ? "MB/s" : "Mbps"}
                      description="Download speed"
                      color="#3b82f6"
                      delay={0.1}
                    />
                    <MetricCard
                      icon={ArrowUpCircle}
                      label="Upload"
                      value={unit === "byte" ? result.upload / 8 : result.upload}
                      unit={unit === "byte" ? "MB/s" : "Mbps"}
                      description="Upload speed"
                      color="#10b981"
                      delay={0.2}
                    />
                    <MetricCard
                      icon={Waves}
                      label="Jitter"
                      value={result.jitter}
                      unit="ms"
                      description="Latency variation"
                      color="#f59e0b"
                      delay={0.3}
                      decimals={1}
                    />
                  </div>

                  {/* Quality Score + Live Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <QualityScore
                      score={result.qualityScore}
                      rating={result.qualityRating}
                    />
                    <div className="lg:col-span-2">
                      <LiveChart history={history} />
                    </div>
                  </div>

                  {/* Share Card */}
                  <ShareCard result={result} unit={unit} />

                  {/* Device Info */}
                  <DeviceInfo />
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <Features />

        {/* History + About Section */}
        <section id="about" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Test History
              </h2>
              <p className="text-white/40">
                Your recent speed tests, stored locally on your device.
              </p>
            </motion.div>

            <HistoryTable history={history} onClear={handleClearHistory} unit={unit} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
