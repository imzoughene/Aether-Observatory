import type { FilterParams } from '../common/filter-params.model';

/** Base path prefix for all mock/real API routes */
export const API_BASE_PATH = '/api/v1';

export const API_ENDPOINTS = {
  probes: `${API_BASE_PATH}/probes`,
  probeById: (id: string) => `${API_BASE_PATH}/probes/${id}`,
  telemetry: `${API_BASE_PATH}/telemetry`,
  kpis: `${API_BASE_PATH}/kpis`,
} as const;

/** Query params for GET /probes */
export type ProbesListQuery = FilterParams;

/** Query params for GET /telemetry */
export interface TelemetryQuery extends FilterParams {
  probeId: string;
  /** ISO 8601 inclusive range start */
  from: string;
  /** ISO 8601 inclusive range end */
  to: string;
}

/** Standard error body returned by the mock API */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, string | string[]>;
}
