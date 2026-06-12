"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, Maximize, Globe, Wifi, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { detectDeviceInfo } from "@/lib/utils";

export function DeviceInfo() {
  const [info, setInfo] = useState<ReturnType<typeof detectDeviceInfo> | null>(null);

  useEffect(() => {
    setInfo(detectDeviceInfo());
  }, []);

  if (!info) return null;

  const items = [
    { icon: Globe, label: "Browser", value: info.browser },
    { icon: Monitor, label: "OS", value: info.os },
    { icon: Smartphone, label: "Device", value: info.deviceType },
    { icon: Maximize, label: "Display", value: info.screenResolution },
    { icon: Cpu, label: "Hardware", value: `${info.cpuCores} • ${info.deviceMemory}` },
    { icon: Wifi, label: "Network", value: info.connectionType },
  ];

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="font-bold uppercase tracking-wider text-xs mb-6" style={{ color: "var(--text-secondary)" }}>Device & Network</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--icon-container-bg)", border: "1px solid var(--icon-container-border)" }}>
              <item.icon className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{item.label}</p>
              <p className="text-sm font-semibold truncate max-w-[140px] mt-0.5" style={{ color: "var(--text-primary)" }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
