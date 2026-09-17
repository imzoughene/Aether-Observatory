export type SortDirection = 'asc' | 'desc';

/** Structured sort descriptor (preferred in application code). */
export interface SortParam {
  field: string;
  direction: SortDirection;
}

/**
 * Shared query parameters for list endpoints.
 * `sort` and `filter` accept both structured objects and serialized query-string forms
 * so the same type works in services and when parsing HTTP params.
 */
export interface FilterParams {
  /** Zero-based row offset (default: 0) */
  offset?: number;
  /** Page size (default: 20, max enforced by API) */
  limit?: number;
  /**
   * Sort expression.
   * Query string form: `field:asc` or `field:desc` (e.g. `name:asc`).
   */
  sort?: SortParam | string;
  /**
   * Field filters.
   * Query string form: JSON object, e.g. `{"status":"active","type":"HTTP"}`.
   */
  filter?: Record<string, string | string[]> | string;
  /** Free-text search across searchable fields */
  search?: string;
}

/** Default pagination values aligned with the mock API contract. */
export const DEFAULT_PAGE_OFFSET = 0;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;
