export interface SpeedTestResult {
  id: string;
  timestamp: number;
  download: number;
  upload: number;
  qualityScore: number;
  qualityRating: QualityRating;
}

export type QualityRating = "Excellent" | "Good" | "Average" | "Poor";

export type TestPhase = "idle" | "download" | "upload" | "complete";

export interface TestProgress {
  phase: TestPhase;
  currentSpeed: number;
  download: number;
  upload: number;
  downloadSamples: number[];
  uploadSamples: number[];
  progress: number;
  speedResetKey: number;
}

export interface DeviceInfo {
  browser: string;
  platform: string;
  screenResolution: string;
  deviceMemory: string;
  cpuCores: string;
  userAgent: string;
  connectionType: string;
}

export interface NetworkInfo {
  ip: string;
  connectionType: string;
  userAgent: string;
}
