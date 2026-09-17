import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '@aether/ui-shared';
import {
  BarChartComponent,
  DonutChartComponent,
  TimeSeriesChartComponent,
} from '@aether/ui-charts';
import {
  AnalyticsGrouping,
  AnalyticsMetric,
  AnalyticsRange,
  AnalyticsService,
} from './analytics.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    CardComponent,
    TimeSeriesChartComponent,
    BarChartComponent,
    DonutChartComponent,
  ],
  selector: 'aether-analytics',
  providers: [AnalyticsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="analytics-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Insights</p>
          <h2>Analytics</h2>
          <p class="subtitle">Explore operational signals across your selected time window.</p>
        </div>
        <div class="summary">
          <span>Period total</span>
          <strong>{{ (analytics.viewModel$ | async)?.total }}</strong>
          <small>{{ (analytics.viewModel$ | async)?.change }} vs previous period</small>
        </div>
      </header>

      <form class="filters" aria-label="Analytics filters">
        <label>
          Date range
          <select [ngModel]="range" (ngModelChange)="changeRange($event)" name="range">
            @for (option of rangeOptions; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </label>
        <label>
          Group by
          <select [ngModel]="grouping" (ngModelChange)="changeGrouping($event)" name="grouping">
            @for (option of groupingOptions; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </label>
        <label>
          Metric
          <select [ngModel]="metric" (ngModelChange)="changeMetric($event)" name="metric">
            @for (option of metricOptions; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </label>
      </form>

      @if (analytics.viewModel$ | async; as view) {
        <div class="chart-grid">
          <aether-card variant="default" padding="lg" [header]="true">
            <div cardHeader class="chart-header">
              <h3>Signal over time</h3>
              <span class="chart-meta">{{ groupingLabel }}</span>
            </div>
            <aether-time-series-chart
              [series]="view.timeSeries"
              [config]="timeSeriesConfig(view.labels)"
            />
          </aether-card>

          <aether-card variant="default" padding="lg" [header]="true">
            <div cardHeader class="chart-header">
              <h3>Aggregated volume</h3>
              <span class="chart-meta">Mock server-side grouping</span>
            </div>
            <aether-bar-chart [series]="view.volume" [config]="barConfig(view.labels)" />
          </aether-card>

          <aether-card variant="default" padding="lg" [header]="true">
            <div cardHeader class="chart-header">
              <h3>Distribution</h3>
              <span class="chart-meta">Current window</span>
            </div>
            <aether-donut-chart [segments]="view.distribution" [config]="donutConfig(view.total)" />
          </aether-card>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .analytics-page {
        display: grid;
        gap: 24px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }

      .eyebrow {
        margin: 0 0 4px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #64748b;
      }

      h2 {
        margin: 0;
        color: #0f172a;
      }

      .subtitle {
        margin: 8px 0 0;
        color: #64748b;
      }

      .summary {
        display: grid;
        align-content: center;
        min-width: 150px;
        text-align: right;
      }

      .summary span,
      .summary small {
        color: #64748b;
        font-size: 12px;
      }

      .summary strong {
        color: #0f766e;
        font-size: 28px;
      }

      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding: 16px 20px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
      }

      label {
        display: grid;
        gap: 6px;
        min-width: 160px;
        color: #475569;
        font-size: 12px;
        font-weight: 600;
      }

      select {
        min-height: 38px;
        padding: 0 34px 0 10px;
        color: #0f172a;
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font: inherit;
      }

      .chart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
      }

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
      }

      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 16px;
      }

      .chart-meta {
        font-size: 12px;
        color: #64748b;
      }

      @media (max-width: 640px) {
        .page-header {
          display: grid;
        }

        .summary {
          text-align: left;
        }

        label {
          width: 100%;
        }
      }
    `,
  ],
})
export class AnalyticsComponent {
  readonly analytics = inject(AnalyticsService);
  range: AnalyticsRange = '30d';
  grouping: AnalyticsGrouping = 'day';
  metric: AnalyticsMetric = 'requests';

  readonly rangeOptions = [
    { value: '7d' as const, label: 'Last 7 days' },
    { value: '30d' as const, label: 'Last 30 days' },
    { value: '90d' as const, label: 'Last 90 days' },
  ];
  readonly groupingOptions = [
    { value: 'hour' as const, label: 'Hourly' },
    { value: 'day' as const, label: 'Daily' },
    { value: 'week' as const, label: 'Weekly' },
  ];
  readonly metricOptions = [
    { value: 'requests' as const, label: 'Requests' },
    { value: 'latency' as const, label: 'P95 latency' },
    { value: 'errors' as const, label: 'Errors' },
  ];

  get groupingLabel(): string {
    return this.groupingOptions.find((option) => option.value === this.grouping)?.label ?? '';
  }

  changeRange(range: AnalyticsRange): void {
    this.range = range;
    this.analytics.setRange(range);
  }

  changeGrouping(grouping: AnalyticsGrouping): void {
    this.grouping = grouping;
    this.analytics.setGrouping(grouping);
  }

  changeMetric(metric: AnalyticsMetric): void {
    this.metric = metric;
    this.analytics.setMetric(metric);
  }

  timeSeriesConfig(labels: string[]) {
    return {
      categories: labels,
      yAxisTitle: this.metric === 'latency' ? 'Milliseconds' : 'Events',
    };
  }

  barConfig(labels: string[]) {
    return { categories: labels, yAxisTitle: 'Events' };
  }

  donutConfig(total: string) {
    return {
      centerLabel: this.metric === 'latency' ? 'Requests' : 'Total',
      centerValue: total,
      showLegend: true,
    };
  }
}
