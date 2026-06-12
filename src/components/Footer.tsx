"use client";


import { useTheme } from "@/components/ThemeProvider";

export function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="relative z-10 backdrop-blur-xl" style={{ borderTop: "1px solid var(--border-primary)", background: "var(--footer-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                alt="Flynk"
                style={{ height: 28, width: "auto" }}
                className="object-contain"
              />
            </div>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: "var(--text-muted)" }}>
              A modern internet speed test built with cutting-edge technology.
              Measure your download and upload speeds with precision.
            </p>
            <p className="text-xs mt-4" style={{ color: "var(--text-faint)" }}>
              Built with Next.js and deployed on Vercel
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Product</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#home" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                  Speed Test
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sam-eer31/internet_speed_test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>About</span>
              </li>
              <li>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            &copy; {new Date().getFullYear()} Flynk. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            Powered by Next.js &amp; Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
