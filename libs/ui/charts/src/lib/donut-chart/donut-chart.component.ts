import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';
import {
  DEFAULT_CHART_HEIGHT,
  baseChartDefaults,
  baseDataLabelsDefaults,
  baseLegendDefaults,
  baseTooltipDefaults,
  resolveChartColors,
  responsiveDefaults,
} from '../defaults/chart-defaults';
import { DonutChartConfig, DonutChartSegment } from '../models/chart.models';

@Component({
  selector: 'aether-donut-chart',
  standalone: true,
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent {
  readonly segments = input.required<DonutChartSegment[]>();
  readonly config = input<DonutChartConfig>({});

  readonly hasData = computed(() =>
    this.segments().some((segment) => segment.value > 0)
  );

  readonly labels = computed(() =>
    this.segments().map((segment) => segment.label)
  );

  readonly apexSeries = computed((): ApexNonAxisChartSeries =>
    this.segments().map((segment) => segment.value)
  );

  readonly colors = computed(() =>
    resolveChartColors(
      this.config().colors,
      this.segments().map((segment) => segment.color)
    )
  );

  readonly chartOptions = computed((): ApexChart => {
    const config = this.config();
    return {
      ...baseChartDefaults,
      type: 'donut',
      height: config.height ?? DEFAULT_CHART_HEIGHT,
    };
  });

  readonly plotOptions = computed((): ApexPlotOptions => {
    const config = this.config();
    const centerLabel = config.centerLabel;
    const centerValue = config.centerValue;

    return {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: !!(centerLabel || centerValue),
            name: {
              show: !!centerLabel,
              fontSize: '13px',
              color: '#64748b',
              offsetY: centerValue ? -8 : 0,
            },
            value: {
              show: centerValue !== undefined,
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a',
              offsetY: centerLabel ? 8 : 0,
            },
            total: {
              show: !!(centerLabel || centerValue !== undefined),
              label: centerLabel ?? '',
              formatter: () =>
                centerValue !== undefined ? String(centerValue) : '',
            },
          },
        },
      },
    };
  });

  readonly legend = computed((): ApexLegend => ({
    ...baseLegendDefaults,
    show: this.config().showLegend ?? true,
  }));

  readonly dataLabels = computed((): ApexDataLabels => ({
    ...baseDataLabelsDefaults,
    enabled: this.config().showLabels ?? false,
  }));

  readonly tooltip = computed((): ApexTooltip => ({
    ...baseTooltipDefaults,
    y: {
      formatter: (value: number) => value.toLocaleString(),
    },
  }));

  readonly responsive = computed((): ApexResponsive[] => responsiveDefaults);
}
