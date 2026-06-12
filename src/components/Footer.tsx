import { Gauge } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
                <Gauge className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Speed<span className="text-indigo-400">Test</span>
              </span>
            </div>
            <p className="text-white/40 text-sm max-w-md leading-relaxed">
              A modern internet speed test built with cutting-edge technology.
              Measure your download and upload speeds with precision.
            </p>
            <p className="text-white/25 text-xs mt-4">
              Built with Next.js and deployed on Vercel
            </p>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#home" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  Speed Test
                </a>
              </li>
              <li>
                <a href="#features" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-white/40 text-sm">About</span>
              </li>
              <li>
                <span className="text-white/40 text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-white/40 text-sm">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} SpeedTest. All rights reserved.
          </p>
          <p className="text-white/25 text-xs">
            Powered by Next.js &amp; Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
