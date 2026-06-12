"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Globe, Clock, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Measurements",
    description: "Watch your speed update in real-time with our animated gauge and live charts.",
    color: "#f59e0b",
  },
  {
    icon: Shield,
    title: "Quality Score",
    description: "Get a comprehensive quality score based on all metrics of your connection.",
    color: "#10b981",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "View live graphs, historical data, and detailed breakdowns of your connection.",
    color: "#3b82f6",
  },
  {
    icon: Globe,
    title: "Network Detection",
    description: "Automatically detect your browser, device info, and connection type.",
    color: "#8b5cf6",
  },
  {
    icon: Clock,
    title: "Test History",
    description: "Track your speed tests over time with local storage and export options.",
    color: "#06b6d4",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download your results as PNG or CSV and share them with anyone.",
    color: "#ec4899",
  },
];

export function Features() {
  return (
    <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-heading)" }}>
            Powerful Features
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Everything you need to understand and monitor your internet connection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ backgroundColor: `${feature.color}08` }}
              />
              <div
                className="relative backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 h-full"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-bg-hover)";
                  e.currentTarget.style.borderColor = "var(--card-border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                  e.currentTarget.style.borderColor = "var(--card-border)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}12` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-heading)" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
