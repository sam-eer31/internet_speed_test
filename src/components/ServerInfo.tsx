"use client";

import { useEffect, useState } from "react";
import { Server, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function ServerInfo() {
  const [isp, setIsp] = useState<string>("Loading...");
  const [server, setServer] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchInfo() {
      try {
        const [cfRes, ipInfoRes] = await Promise.allSettled([
          fetch("https://speed.cloudflare.com/meta").then((r) => r.json()),
          fetch("https://ipinfo.io/json").then((r) => r.json()),
        ]);

        let finalIsp = "Unknown Provider";
        let finalServer = "Unknown Server";

        if (ipInfoRes.status === "fulfilled" && ipInfoRes.value && ipInfoRes.value.org) {
          finalIsp = ipInfoRes.value.org.replace(/^AS\d+\s/, "");
        } else if (cfRes.status === "fulfilled" && cfRes.value && cfRes.value.asOrganization) {
          finalIsp = cfRes.value.asOrganization;
        }

        if (cfRes.status === "fulfilled" && cfRes.value) {
          finalServer = cfRes.value.city
            ? `${cfRes.value.city}, ${cfRes.value.country || ""}`
            : "Cloudflare Edge";
        }

        setIsp(finalIsp);
        setServer(finalServer);
      } catch (err) {
        setIsp("Unknown Provider");
        setServer("Unknown Server");
      }
    }

    fetchInfo();
  }, []);

  return (
    <motion.div
      className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm" 
        style={{ 
          background: "var(--badge-bg)", 
          border: "1px solid var(--badge-border)" 
        }}
      >
        <Shield className="w-4 h-4 text-indigo-400" />
        <span style={{ color: "var(--text-muted)" }}>Provider:</span>
        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{isp}</span>
      </div>
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm" 
        style={{ 
          background: "var(--badge-bg)", 
          border: "1px solid var(--badge-border)" 
        }}
      >
        <Server className="w-4 h-4 text-emerald-400" />
        <span style={{ color: "var(--text-muted)" }}>Server:</span>
        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{server}</span>
      </div>
    </motion.div>
  );
}
