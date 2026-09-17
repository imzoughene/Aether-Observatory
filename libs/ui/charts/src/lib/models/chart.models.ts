export type TimeSeriesCurve = 'smooth' | 'straight' | 'stepline';
export type TimeSeriesXAxisType = 'category' | 'datetime' | 'numeric';

export interface TimeSeriesPoint {
  x: string | number | Date;
  y: number;
}

export interface TimeSeriesSeries {
  name: string;
  data: number[] | TimeSeriesPoint[];
  color?: string;
}

export interface TimeSeriesChartConfig {
  height?: number;
  showToolbar?: boolean;
  curve?: TimeSeriesCurve;
  yAxisTitle?: string;
  xAxisType?: TimeSeriesXAxisType;
  categories?: string[];
  colors?: string[];
}

export interface DonutChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartConfig {
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  colors?: string[];
}

export interface BarChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface BarChartConfig {
  height?: number;
  categories: string[];
  horizontal?: boolean;
  stacked?: boolean;
  showToolbar?: boolean;
  yAxisTitle?: string;
  colors?: string[];
}
