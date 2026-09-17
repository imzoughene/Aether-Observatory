import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import {
  DEFAULT_CHART_HEIGHT,
  baseChartDefaults,
  baseDataLabelsDefaults,
  baseGridDefaults,
  baseLegendDefaults,
  baseTooltipDefaults,
  resolveChartColors,
  responsiveDefaults,
} from '../defaults/chart-defaults';
import {
  TimeSeriesChartConfig,
  TimeSeriesSeries,
} from '../models/chart.models';

@Component({
  selector: 'aether-time-series-chart',
  standalone: true,
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.scss'],
})
export class TimeSeriesChartComponent {
  readonly series = input.required<TimeSeriesSeries[]>();
  readonly config = input<TimeSeriesChartConfig>({});

  readonly hasData = computed(() =>
    this.series().some((entry) => entry.data.length > 0)
  );

  readonly colors = computed(() =>
    resolveChartColors(
      this.config().colors,
      this.series().map((entry) => entry.color)
    )
  );

  readonly apexSeries = computed((): ApexAxisChartSeries =>
    this.series().map((entry) => ({
      name: entry.name,
      data: entry.data,
    }))
  );

  readonly chartOptions = computed((): ApexChart => {
    const config = this.config();
    return {
      ...baseChartDefaults,
      type: 'area',
      height: config.height ?? DEFAULT_CHART_HEIGHT,
      toolbar: { show: config.showToolbar ?? false },
    };
  });

  readonly xAxis = computed((): ApexXAxis => {
    const config = this.config();
    return {
      type: config.xAxisType ?? 'category',
      categories: config.categories,
      labels: { style: { colors: '#64748b', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    };
  });

  readonly yAxis = computed((): ApexYAxis => ({
    title: this.config().yAxisTitle
      ? { text: this.config().yAxisTitle, style: { color: '#64748b' } }
      : undefined,
    labels: { style: { colors: '#64748b', fontSize: '12px' } },
  }));

  readonly stroke = computed((): ApexStroke => ({
    curve: this.config().curve ?? 'smooth',
    width: 2,
  }));

  readonly fill = computed((): ApexFill => ({
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.4,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  }));

  readonly grid = computed((): ApexGrid => baseGridDefaults);
  readonly legend = computed((): ApexLegend => baseLegendDefaults);
  readonly tooltip = computed((): ApexTooltip => baseTooltipDefaults);
  readonly dataLabels = computed((): ApexDataLabels => baseDataLabelsDefaults);
  readonly responsive = computed((): ApexResponsive[] => responsiveDefaults);
}
