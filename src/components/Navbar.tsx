"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Menu, X, Settings, Sun, Moon, Monitor } from "lucide-react";
import Link from "next/link";

import { useTheme } from "@/components/ThemeProvider";

interface NavbarProps {
  unit: "bit" | "byte";
  onUnitChange: (unit: "bit" | "byte") => void;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const themeOptions = [
  { value: "system" as const, label: "System", icon: Monitor },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
];

export function Navbar({ unit, onUnitChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <motion.nav
      className="fixed top-4 left-1/2 z-50 w-[92%] max-w-7xl backdrop-blur-xl rounded-2xl"
      style={{
        background: "var(--nav-bg)",
        borderColor: "var(--nav-border)",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "var(--nav-shadow)",
      }}
      initial={{ y: -100, x: "-50%" }}
      animate={{ y: 0, x: "-50%" }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
              alt="Flynk"
              style={{ height: 32, width: "auto" }}
              className="object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>
 
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                style={{ color: "var(--nav-link-color)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.background = "var(--nav-link-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--nav-link-color)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/sam-eer31/internet_speed_test"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
              style={{ color: "var(--nav-link-color)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = "var(--nav-link-hover-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--nav-link-color)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
 
            {/* Settings Dropdown Button */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  color: isSettingsOpen ? "var(--text-primary)" : "var(--nav-link-color)",
                  background: isSettingsOpen ? "var(--nav-link-hover-bg)" : "transparent",
                }}
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
                      className="absolute right-0 mt-2 w-56 backdrop-blur-xl rounded-2xl p-4 z-50"
                      style={{
                        background: "var(--dropdown-bg)",
                        border: "1px solid var(--dropdown-border)",
                        boxShadow: "var(--dropdown-shadow)",
                      }}
                    >
                      <p className="text-[9px] font-bold tracking-widest uppercase mb-2.5" style={{ color: "var(--text-faint)" }}>
                        Settings
                      </p>

                      {/* Theme Section */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                          Theme
                        </p>
                        <div className="flex rounded-lg p-0.5 relative" style={{ background: "var(--toggle-bg)", border: "1px solid var(--toggle-border)" }}>
                          {themeOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setTheme(opt.value)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors"
                              style={{
                                color: theme === opt.value ? "var(--text-primary)" : "var(--text-faint)",
                              }}
                            >
                              <opt.icon className="w-3 h-3" />
                              {opt.label}
                            </button>
                          ))}
                          <motion.div
                            className="absolute top-0.5 bottom-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-[6px]"
                            layoutId="activeThemeDesktop"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            style={{
                              width: "calc(33.333% - 2px)",
                              left: theme === "system" ? "2px" : theme === "light" ? "calc(33.333%)" : "calc(66.666%)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Unit System Section */}
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                          Unit System
                        </p>
                        <div className="flex rounded-lg p-0.5 relative" style={{ background: "var(--toggle-bg)", border: "1px solid var(--toggle-border)" }}>
                          <button
                            onClick={() => onUnitChange("byte")}
                            className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors`}
                            style={{
                              color: unit === "byte" ? "var(--text-primary)" : "var(--text-faint)",
                            }}
                          >
                            Byte (MB/s)
                          </button>
                          <button
                            onClick={() => onUnitChange("bit")}
                            className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors`}
                            style={{
                              color: unit === "bit" ? "var(--text-primary)" : "var(--text-faint)",
                            }}
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
            className="md:hidden p-2 rounded-lg transition-all"
            style={{ color: "var(--nav-link-color)" }}
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
            className="md:hidden backdrop-blur-2xl rounded-b-2xl overflow-hidden"
            style={{
              borderTop: "1px solid var(--mobile-menu-border)",
              background: "var(--mobile-menu-bg)",
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{ color: "var(--nav-link-color)" }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/sam-eer31/internet_speed_test"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ color: "var(--nav-link-color)" }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                GitHub
              </a>

              {/* Mobile settings section */}
              <div className="pt-4 mt-3 pb-2" style={{ borderTop: "1px solid var(--mobile-menu-border)" }}>
                <p className="px-4 text-[9px] font-bold tracking-widest uppercase mb-2.5" style={{ color: "var(--text-faint)" }}>
                  Settings
                </p>

                {/* Theme Toggle - Mobile */}
                <div className="px-4 mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                    Theme
                  </p>
                  <div className="flex rounded-lg p-0.5 relative" style={{ background: "var(--toggle-bg)", border: "1px solid var(--toggle-border)" }}>
                    {themeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors"
                        style={{
                          color: theme === opt.value ? "var(--text-primary)" : "var(--text-faint)",
                        }}
                      >
                        <opt.icon className="w-3 h-3" />
                        {opt.label}
                      </button>
                    ))}
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-[6px]"
                      layoutId="activeThemeMobile"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{
                        width: "calc(33.333% - 2px)",
                        left: theme === "system" ? "2px" : theme === "light" ? "calc(33.333%)" : "calc(66.666%)",
                      }}
                    />
                  </div>
                </div>

                {/* Unit System - Mobile */}
                <div className="px-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                    Unit System
                  </p>
                  <div className="flex rounded-lg p-0.5 relative" style={{ background: "var(--toggle-bg)", border: "1px solid var(--toggle-border)" }}>
                    <button
                      onClick={() => onUnitChange("byte")}
                      className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors`}
                      style={{
                        color: unit === "byte" ? "var(--text-primary)" : "var(--text-faint)",
                      }}
                    >
                      Byte (MB/s)
                    </button>
                    <button
                      onClick={() => onUnitChange("bit")}
                      className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md relative z-10 transition-colors`}
                      style={{
                        color: unit === "bit" ? "var(--text-primary)" : "var(--text-faint)",
                      }}
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
