"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, HardDrive, Globe, Wifi, Smartphone } from "lucide-react";
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
    { icon: Monitor, label: "Platform", value: info.platform },
    { icon: Smartphone, label: "Screen", value: info.screenResolution },
    { icon: HardDrive, label: "Memory", value: info.deviceMemory },
    { icon: Cpu, label: "CPU", value: info.cpuCores },
    { icon: Wifi, label: "Connection", value: info.connectionType },
  ];

  return (
    <motion.div
      className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-white/80 font-semibold mb-4 text-lg">Device & Network</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/[0.04]">
              <item.icon className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-white/40 text-xs">{item.label}</p>
              <p className="text-white/80 text-sm font-medium truncate max-w-[140px]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
