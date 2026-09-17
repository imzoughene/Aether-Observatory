/** Single telemetry observation for a probe at a point in time */
export interface TelemetrySample {
  id: string;
  probeId: string;
  /** ISO 8601 timestamp when the sample was recorded */
  timestamp: string;
  responseTimeMs: number;
  success: boolean;
  statusCode?: number;
  errorMessage?: string;
  metadata?: Record<string, string | number | boolean>;
}
