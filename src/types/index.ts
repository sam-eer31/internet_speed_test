export interface SpeedTestResult {
  id: string;
  timestamp: number;
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  qualityScore: number;
  qualityRating: QualityRating;
}

export type QualityRating = "Excellent" | "Good" | "Average" | "Poor";

export type TestPhase = "idle" | "ping" | "download" | "upload" | "complete";

export interface TestProgress {
  phase: TestPhase;
  currentSpeed: number;
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  downloadSamples: number[];
  uploadSamples: number[];
  progress: number;
  speedResetKey: number;
}
