/**
 * Standard offset/limit pagination envelope.
 * Designed to map 1:1 to backend responses so mock and real APIs share the same shape.
 */
export interface PaginatedResponse<T> {
  /** Current page items */
  items: T[];
  /** Total matching records (across all pages) */
  total: number;
  /** Zero-based offset of the first item in `items` */
  offset: number;
  /** Maximum items requested (page size) */
  limit: number;
  /** Whether more records exist after this page */
  hasMore: boolean;
}
