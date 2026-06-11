"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
