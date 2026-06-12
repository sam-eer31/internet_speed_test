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
import { ServerInfo } from "@/components/ServerInfo";
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
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--background)" }}>
      {/* Background Layout */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid-overlay" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] glow-blob-1 rounded-full blur-[140px] opacity-80" />
        <div className="absolute top-[35%] left-[-15%] w-[600px] h-[600px] glow-blob-2 rounded-full blur-[130px] opacity-40 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] glow-blob-3 rounded-full blur-[150px] opacity-50" />
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
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-5 text-[10px] sm:text-xs font-semibold tracking-wider text-indigo-400 uppercase"
                style={{
                  background: "var(--badge-bg)",
                  border: "1px solid var(--badge-border)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Real-Time Network Diagnostics
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent tracking-tight"
                style={{
                  backgroundImage: "linear-gradient(to bottom, var(--text-heading), var(--text-secondary), var(--text-faint))",
                }}
              >
                Internet Speed Test
              </h1>
              <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
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
                    : (progress.phase === "ping"
                        ? progress.currentSpeed
                        : (unit === "byte" ? progress.currentSpeed / 8 : progress.currentSpeed))
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
                      <span style={{ color: "var(--text-muted)" }}>
                        Ping:{" "}
                        <span className="text-purple-400 font-semibold tabular-nums">
                          {(progress.ping ?? 0).toFixed(1)} ms
                        </span>
                      </span>
                    )}
                    {progress.download > 0 && (
                      <span style={{ color: "var(--text-muted)" }}>
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
                      <span style={{ color: "var(--text-muted)" }}>
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
                    className="group relative px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,184,249,0.3)] hover:shadow-[0_8px_30px_rgba(0,69,224,0.4)]"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Initiate Diagnostics"
                  >
                    {/* Primary Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00b8f9] to-[#0045e0] transition-opacity duration-300 group-hover:opacity-90" />
                    
                    {/* Shimmer sweep effect */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />

                    {/* Content */}
                    <span className="relative z-20 flex items-center justify-center gap-3 text-lg sm:text-xl tracking-[0.25em] uppercase font-black" style={{ textShadow: "0 2px 15px rgba(255,255,255,0.4)" }}>
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white drop-shadow-md" />
                      <span>{showResults ? "RESTART" : "BEGIN"}</span>
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={stopTest}
                    className="group relative px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-white overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.6)]"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    aria-label="Abort Test"
                  >
                    {/* Primary Background */}
                    <div className="absolute inset-0 bg-red-600 transition-colors duration-300 group-hover:bg-red-500" />
                    
                    {/* Shimmer sweep effect */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />

                    {/* Content */}
                    <span className="relative z-20 flex items-center justify-center gap-3 text-lg sm:text-xl tracking-[0.25em] uppercase font-black" style={{ textShadow: "0 2px 15px rgba(255,255,255,0.4)" }}>
                      <Square className="w-5 h-5 sm:w-6 sm:h-6 fill-white drop-shadow-md" />
                      <span>STOP</span>
                    </span>
                  </motion.button>
                )}
              </motion.div>
              <ServerInfo />
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
                      value={result.ping ?? 0}
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
                      value={result.jitter ?? 0}
                      unit="ms"
                      description="Latency variation"
                      color="#f59e0b"
                      delay={0.3}
                      decimals={1}
                    />
                  </div>

                  {/* Quality Score + Live Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={history.length < 2 ? "lg:col-span-3 flex justify-center" : "lg:col-span-1"}>
                      <QualityScore
                        score={result.qualityScore}
                        rating={result.qualityRating}
                      />
                    </div>
                    {history.length >= 2 && (
                      <div className="lg:col-span-2">
                        <LiveChart history={history} />
                      </div>
                    )}
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-heading)" }}>
                Test History
              </h2>
              <p style={{ color: "var(--text-muted)" }}>
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
