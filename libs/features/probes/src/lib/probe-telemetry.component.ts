import { Component } from '@angular/core';
import { TimeSeriesChartComponent, TimeSeriesSeries } from '@aether/ui-charts';

const detailTabStyles = `
  article { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  .panel-heading { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
  .panel-heading span { color: #64748b; }
  h3 { margin: 0 0 16px; color: #0f172a; font-size: 16px; }
`;

@Component({
  standalone: true,
  imports: [TimeSeriesChartComponent],
  template: `<article class="chart-panel">
    <div class="panel-heading">
      <h3>Response time</h3>
      <span>Last checks</span>
    </div>
    <aether-time-series-chart [series]="series" [config]="config" />
  </article>`,
  styles: [detailTabStyles],
})
export class ProbeTelemetryComponent {
  readonly series: TimeSeriesSeries[] = [
    { name: 'Response time', data: [142, 126, 131, 118, 124, 120, 124] },
  ];
  readonly config = {
    categories: ['-30m', '-25m', '-20m', '-15m', '-10m', '-5m', 'Now'],
    yAxisTitle: 'Milliseconds',
    curve: 'smooth' as const,
  };
}
