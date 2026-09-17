import type {
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexResponsive,
  ApexTheme,
  ApexTooltip,
} from 'ng-apexcharts';

export const CHART_PALETTE = [
  '#2563eb',
  '#16a34a',
  '#f59e0b',
  '#dc2626',
  '#8b5cf6',
  '#06b6d4',
  '#64748b',
] as const;

export const DEFAULT_CHART_HEIGHT = 320;

export const responsiveDefaults: ApexResponsive[] = [
  {
    breakpoint: 1024,
    options: {
      chart: { height: 300 },
      legend: { position: 'bottom' },
    },
  },
  {
    breakpoint: 640,
    options: {
      chart: { height: 260 },
      legend: { show: false },
      dataLabels: { enabled: false },
    },
  },
];

export const baseChartDefaults: ApexChart = {
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  toolbar: { show: false },
  zoom: { enabled: false },
  animations: { enabled: true, speed: 400 },
};

export const baseGridDefaults: ApexGrid = {
  borderColor: '#e2e8f0',
  strokeDashArray: 4,
  xaxis: { lines: { show: false } },
  yaxis: { lines: { show: true } },
};

export const baseLegendDefaults: ApexLegend = {
  position: 'bottom',
  horizontalAlign: 'center',
  fontSize: '12px',
  labels: { colors: '#64748b' },
  markers: { size: 6, offsetX: -2 },
};

export const baseTooltipDefaults: ApexTooltip = {
  theme: 'light',
  x: { show: true },
};

export const baseDataLabelsDefaults: ApexDataLabels = {
  enabled: false,
};

export const baseThemeDefaults: ApexTheme = {
  mode: 'light',
};

export function resolveChartColors(
  configColors: string[] | undefined,
  seriesColors: Array<string | undefined>,
  fallback: readonly string[] = CHART_PALETTE
): string[] {
  if (configColors?.length) {
    return configColors;
  }

  const explicit = seriesColors.filter((color): color is string => !!color);
  return explicit.length ? explicit : [...fallback];
}
