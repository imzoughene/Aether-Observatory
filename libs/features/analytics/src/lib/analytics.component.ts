import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@aether/ui-shared';
import {
  BarChartComponent,
  BarChartSeries,
  DonutChartComponent,
  DonutChartSegment,
  TimeSeriesChartComponent,
  TimeSeriesSeries,
} from '@aether/ui-charts';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TimeSeriesChartComponent,
    BarChartComponent,
    DonutChartComponent,
  ],
  selector: 'aether-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="analytics-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Insights</p>
          <h2>Analytics</h2>
          <p class="subtitle">Request volume, latency, and response-time distribution.</p>
        </div>
      </header>

      <div class="chart-grid">
        <aether-card variant="default" padding="lg" [header]="true">
          <div cardHeader class="chart-header">
            <h3>Request Volume</h3>
            <span class="chart-meta">Last 7 days</span>
          </div>
          <aether-bar-chart [series]="requestVolumeSeries" [config]="requestVolumeConfig" />
        </aether-card>

        <aether-card variant="default" padding="lg" [header]="true">
          <div cardHeader class="chart-header">
            <h3>Response Time Trend</h3>
            <span class="chart-meta">P95 latency (ms)</span>
          </div>
          <aether-time-series-chart [series]="latencySeries" [config]="latencyConfig" />
        </aether-card>

        <aether-card variant="default" padding="lg" [header]="true">
          <div cardHeader class="chart-header">
            <h3>Response Time Distribution</h3>
            <span class="chart-meta">Current window</span>
          </div>
          <aether-donut-chart [segments]="responseTimeSegments" [config]="responseTimeConfig" />
        </aether-card>
      </div>
    </section>
  `,
  styles: [
    `
      .analytics-page {
        display: grid;
        gap: 24px;
      }

      .page-header {
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
    `,
  ],
})
export class AnalyticsComponent {
  readonly requestVolumeSeries: BarChartSeries[] = [
    {
      name: 'Requests',
      data: [1240, 1580, 980, 1720, 1450, 1890, 1320],
    },
  ];

  readonly requestVolumeConfig = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yAxisTitle: 'Requests',
  };

  readonly latencySeries: TimeSeriesSeries[] = [
    {
      name: 'P95 Latency',
      data: [142, 138, 155, 149, 162, 158, 151],
    },
  ];

  readonly latencyConfig = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yAxisTitle: 'Milliseconds',
    curve: 'smooth' as const,
  };

  readonly responseTimeSegments: DonutChartSegment[] = [
    { label: '< 100ms', value: 42, color: '#16a34a' },
    { label: '100–300ms', value: 35, color: '#2563eb' },
    { label: '300–500ms', value: 15, color: '#f59e0b' },
    { label: '> 500ms', value: 8, color: '#dc2626' },
  ];

  readonly responseTimeConfig = {
    centerLabel: 'Requests',
    centerValue: '12.4k',
    showLegend: true,
  };
}
