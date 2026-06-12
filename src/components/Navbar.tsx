"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, ExternalLink, Menu, X, Settings } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  unit: "bit" | "byte";
  onUnitChange: (unit: "bit" | "byte") => void;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export function Navbar({ unit, onUnitChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/[0.06]"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 group-hover:from-indigo-500/30 group-hover:to-cyan-500/30 transition-all">
              <Gauge className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Speed<span className="text-indigo-400">Test</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/sam-eer31/internet_speed_test"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>

            {/* Settings Dropdown Button */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-all ${
                  isSettingsOpen ? "bg-white/[0.05] text-white" : ""
                }`}
                aria-label="Settings"
              >
                <Settings className={`w-4.5 h-4.5 transition-transform duration-300 ${isSettingsOpen ? "rotate-45" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isSettingsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#0a0a20]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50"
                    >
                      <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2.5">
                        Settings
                      </p>
                      <div>
                        <p className="text-xs font-semibold text-white/75 mb-2">
                          Unit System
                        </p>
                        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5 relative">
                          <button
                            onClick={() => onUnitChange("byte")}
                            className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors ${
                              unit === "byte" ? "text-white" : "text-white/40 hover:text-white/60"
                            }`}
                          >
                            Byte (MB/s)
                          </button>
                          <button
                            onClick={() => onUnitChange("bit")}
                            className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors ${
                              unit === "bit" ? "text-white" : "text-white/40 hover:text-white/60"
                            }`}
                          >
                            Bit (Mbps)
                          </button>
                          <motion.div
                            className="absolute top-0.5 bottom-0.5 bg-indigo-500 rounded-[6px]"
                            layoutId="activeUnitDesktop"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            style={{
                              width: "calc(50% - 2px)",
                              left: unit === "byte" ? "2px" : "calc(50%)",
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-black/40 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/sam-eer31/internet_speed_test"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-base text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>

              {/* Mobile settings section */}
              <div className="border-t border-white/[0.06] pt-4 mt-3 pb-2">
                <p className="px-4 text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2.5">
                  Settings
                </p>
                <div className="px-4">
                  <p className="text-xs font-semibold text-white/75 mb-2">
                    Unit System
                  </p>
                  <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5 relative">
                    <button
                      onClick={() => onUnitChange("byte")}
                      className={`flex-1 text-center py-2 text-[11px] font-semibold rounded-md relative z-10 transition-colors ${
                        unit === "byte" ? "text-white" : "text-white/40"
                      }`}
                    >
                      Byte (MB/s)
                    </button>
                    <button
                      onClick={() => onUnitChange("bit")}
                      className={`flex-1 text-center py-2 text-[11px] font-semibold rounded-md relative z-10 transition-colors ${
                        unit === "bit" ? "text-white" : "text-white/40"
                      }`}
                    >
                      Bit (Mbps)
                    </button>
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 bg-indigo-500 rounded-[6px]"
                      layoutId="activeUnitMobile"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{
                        width: "calc(50% - 2px)",
                        left: unit === "byte" ? "2px" : "calc(50%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
