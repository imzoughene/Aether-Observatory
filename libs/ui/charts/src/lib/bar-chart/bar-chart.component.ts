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
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
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
import { BarChartConfig, BarChartSeries } from '../models/chart.models';

@Component({
  selector: 'aether-bar-chart',
  standalone: true,
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  readonly series = input.required<BarChartSeries[]>();
  readonly config = input.required<BarChartConfig>();

  readonly hasData = computed(() =>
    this.series().some((entry) => entry.data.some((value) => value > 0))
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
      type: 'bar',
      height: config.height ?? DEFAULT_CHART_HEIGHT,
      stacked: config.stacked ?? false,
      toolbar: { show: config.showToolbar ?? false },
    };
  });

  readonly plotOptions = computed((): ApexPlotOptions => {
    const config = this.config();
    return {
      bar: {
        horizontal: config.horizontal ?? false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    };
  });

  readonly xAxis = computed((): ApexXAxis => ({
    categories: this.config().categories,
    labels: { style: { colors: '#64748b', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  }));

  readonly yAxis = computed((): ApexYAxis => ({
    title: this.config().yAxisTitle
      ? { text: this.config().yAxisTitle, style: { color: '#64748b' } }
      : undefined,
    labels: { style: { colors: '#64748b', fontSize: '12px' } },
  }));

  readonly grid = computed((): ApexGrid => baseGridDefaults);
  readonly legend = computed((): ApexLegend => ({
    ...baseLegendDefaults,
    show: this.series().length > 1,
  }));
  readonly tooltip = computed((): ApexTooltip => baseTooltipDefaults);
  readonly dataLabels = computed((): ApexDataLabels => baseDataLabelsDefaults);
  readonly responsive = computed((): ApexResponsive[] => responsiveDefaults);
}
