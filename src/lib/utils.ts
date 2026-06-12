import { QualityRating, SpeedTestResult } from "@/types";
import { UAParser } from "ua-parser-js";

export function calculateQualityScore(
  ping: number,
  download: number,
  upload: number,
  jitter: number
): number {
  const pingScore = Math.max(0, Math.min(100, 100 - ping * 1.5));
  const jitterScore = Math.max(0, Math.min(100, 100 - jitter * 5));
  const downloadScore = Math.min(100, (download / 100) * 100);
  const uploadScore = Math.min(100, (upload / 50) * 100);

  const score = Math.round(
    pingScore * 0.2 + jitterScore * 0.1 + downloadScore * 0.45 + uploadScore * 0.25
  );
  return Math.max(0, Math.min(100, score));
}

export function getQualityRating(score: number): QualityRating {
  if (score >= 85) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 40) return "Average";
  return "Poor";
}

export function getQualityColor(rating: QualityRating): string {
  switch (rating) {
    case "Excellent":
      return "#10b981";
    case "Good":
      return "#3b82f6";
    case "Average":
      return "#f59e0b";
    case "Poor":
      return "#ef4444";
  }
}

export function formatMbps(mbps: number): string {
  if (mbps >= 1000) return (mbps / 1000).toFixed(2) + " Gbps";
  return mbps.toFixed(2) + " Mbps";
}

export function formatMs(ms: number | undefined | null): string {
  if (ms === undefined || ms === null || isNaN(ms)) return "0.0 ms";
  return ms.toFixed(1) + " ms";
}


export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getHistory(): SpeedTestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("speedtest-history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: SpeedTestResult): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    history.unshift(result);
    const trimmed = history.slice(0, 50);
    localStorage.setItem("speedtest-history", JSON.stringify(trimmed));
  } catch {
    // storage full or unavailable
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("speedtest-history");
}



export function detectDeviceInfo() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return {
      browser: "Unknown",
      os: "Unknown",
      deviceType: "Desktop",
      screenResolution: "Unknown",
      deviceMemory: "Unknown",
      cpuCores: "Unknown",
      connectionType: "Unknown",
    };
  }

  const parser = new UAParser(navigator.userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; type?: string; downlink?: number };
  };

  const browserStr = browser.name ? `${browser.name} ${browser.version?.split('.')[0] || ''}`.trim() : "Unknown Browser";
  const osStr = os.name ? `${os.name} ${os.version || ''}`.trim() : "Unknown OS";
  
  let deviceType = device.type ? device.type.charAt(0).toUpperCase() + device.type.slice(1) : "Desktop";
  if (device.vendor && device.model) {
    deviceType = `${device.vendor} ${device.model}`;
  }

  let connStr = "Unknown";
  if (nav.connection) {
    const type = nav.connection.type || nav.connection.effectiveType;
    if (type) {
      connStr = type.charAt(0).toUpperCase() + type.slice(1);
      if (connStr === "Wifi") connStr = "WiFi";
      if (nav.connection.effectiveType && ["slow-2g", "2g", "3g", "4g"].includes(nav.connection.effectiveType)) {
        connStr = nav.connection.effectiveType.toUpperCase();
        if (nav.connection.type === "cellular") connStr += " Cellular";
      }
    }
  }

  return {
    browser: browserStr,
    os: osStr,
    deviceType: deviceType,
    screenResolution: `${window.screen.width} × ${window.screen.height}`,
    deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "N/A",
    cpuCores: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Cores` : "N/A",
    connectionType: connStr,
  };
}
