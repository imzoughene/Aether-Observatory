export type KpiTrend = 'up' | 'down' | 'stable';

export type KpiSeverity = 'success' | 'warning' | 'error' | 'neutral';

export type KpiCategory = 'probes' | 'telemetry' | 'uptime' | 'performance';

/** Dashboard KPI tile — returned by GET /kpis */
export interface Kpi {
  id: string;
  label: string;
  value: number;
  unit?: string;
  /** Human-readable display value (e.g. "99.7%") */
  formattedValue?: string;
  trend?: KpiTrend;
  trendPercent?: number;
  severity?: KpiSeverity;
  category: KpiCategory;
}
