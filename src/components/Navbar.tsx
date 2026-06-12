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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl bg-[#06080d]/65 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
      initial={{ y: -100, x: "-50%" }}
      animate={{ y: 0, x: "-50%" }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 group-hover:from-indigo-500/25 group-hover:to-cyan-500/25 transition-all duration-300">
              <Gauge className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Speed<span className="text-indigo-400">Test</span>
            </span>
          </Link>
 
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/sam-eer31/internet_speed_test"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
 
            {/* Settings Dropdown Button */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200 ${
                  isSettingsOpen ? "bg-white/[0.04] text-white" : ""
                }`}
                aria-label="Settings"
              >
                <Settings className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? "rotate-45" : ""}`} />
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
                      className="absolute right-0 mt-2 w-52 bg-[#090c15]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_12px_35px_rgba(0,0,0,0.6)] z-50"
                    >
                      <p className="text-[9px] font-bold tracking-widest uppercase text-white/30 mb-2.5">
                        Settings
                      </p>
                      <div>
                        <p className="text-xs font-semibold text-white/70 mb-2">
                          Unit System
                        </p>
                        <div className="flex bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5 relative">
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
                            className="absolute top-0.5 bottom-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-[6px]"
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
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
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
            className="md:hidden border-t border-white/[0.06] bg-[#06080d]/90 backdrop-blur-2xl rounded-b-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/sam-eer31/internet_speed_test"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                GitHub
              </a>

              {/* Mobile settings section */}
              <div className="border-t border-white/[0.06] pt-4 mt-3 pb-2">
                <p className="px-4 text-[9px] font-bold tracking-widest uppercase text-white/30 mb-2.5">
                  Settings
                </p>
                <div className="px-4">
                  <p className="text-xs font-semibold text-white/70 mb-2">
                    Unit System
                  </p>
                  <div className="flex bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5 relative">
                    <button
                      onClick={() => onUnitChange("byte")}
                      className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors ${
                        unit === "byte" ? "text-white" : "text-white/40"
                      }`}
                    >
                      Byte (MB/s)
                    </button>
                    <button
                      onClick={() => onUnitChange("bit")}
                      className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors ${
                        unit === "bit" ? "text-white" : "text-white/40"
                      }`}
                    >
                      Bit (Mbps)
                    </button>
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-[6px]"
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
