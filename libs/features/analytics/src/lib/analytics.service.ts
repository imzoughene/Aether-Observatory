import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, shareReplay } from 'rxjs';
import { BarChartSeries, DonutChartSegment, TimeSeriesSeries } from '@aether/ui-charts';

export type AnalyticsRange = '7d' | '30d' | '90d';
export type AnalyticsGrouping = 'hour' | 'day' | 'week';
export type AnalyticsMetric = 'requests' | 'latency' | 'errors';

export interface AnalyticsViewModel {
  labels: string[];
  timeSeries: TimeSeriesSeries[];
  volume: BarChartSeries[];
  distribution: DonutChartSegment[];
  total: string;
  change: string;
}

interface AnalyticsQuery {
  range: AnalyticsRange;
  grouping: AnalyticsGrouping;
  metric: AnalyticsMetric;
}

@Injectable()
export class AnalyticsService {
  private readonly rangeSubject = new BehaviorSubject<AnalyticsRange>('30d');
  private readonly groupingSubject = new BehaviorSubject<AnalyticsGrouping>('day');
  private readonly metricSubject = new BehaviorSubject<AnalyticsMetric>('requests');

  private readonly query$ = combineLatest({
    range: this.rangeSubject,
    grouping: this.groupingSubject,
    metric: this.metricSubject,
  });

  readonly range$ = this.query$.pipe(map(({ range }) => range));
  readonly grouping$ = this.query$.pipe(map(({ grouping }) => grouping));
  readonly metric$ = this.query$.pipe(map(({ metric }) => metric));

  readonly viewModel$ = this.query$.pipe(
    map((query) => this.aggregate(query)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  setRange(range: AnalyticsRange): void {
    this.rangeSubject.next(range);
  }

  setGrouping(grouping: AnalyticsGrouping): void {
    this.groupingSubject.next(grouping);
  }

  setMetric(metric: AnalyticsMetric): void {
    this.metricSubject.next(metric);
  }

  private aggregate(query: AnalyticsQuery): AnalyticsViewModel {
    const pointCount = query.grouping === 'hour' ? 24 : query.grouping === 'week' ? 12 : 14;
    const scale = query.range === '7d' ? 0.75 : query.range === '90d' ? 1.35 : 1;
    const labels = Array.from({ length: pointCount }, (_, index) =>
      query.grouping === 'hour'
        ? `${String(index).padStart(2, '0')}:00`
        : query.grouping === 'week'
          ? `W${index + 1}`
          : `Day ${index + 1}`
    );
    const values = labels.map((_, index) => {
      const wave = Math.sin(index * 0.8) * 0.16 + Math.cos(index * 0.35) * 0.08;
      const baseline = query.metric === 'latency' ? 145 : query.metric === 'errors' ? 28 : 1280;
      return Math.round(baseline * scale * (1 + wave + (index % 5) * 0.035));
    });
    const total = values.reduce((sum, value) => sum + value, 0);

    return {
      labels,
      timeSeries: [
        {
          name: this.metricLabel(query.metric),
          data: values,
          color: query.metric === 'errors' ? '#dc2626' : '#0f766e',
        },
      ],
      volume: [
        {
          name: 'Aggregated volume',
          data: values.map((value) => (query.metric === 'latency' ? value * 8 : value)),
          color: '#f97316',
        },
      ],
      distribution: this.distribution(query.metric, total),
      total: total.toLocaleString(),
      change: query.metric === 'errors' ? '+2.4%' : '+12.8%',
    };
  }

  private metricLabel(metric: AnalyticsMetric): string {
    return metric === 'latency' ? 'P95 latency (ms)' : metric === 'errors' ? 'Errors' : 'Requests';
  }

  private distribution(metric: AnalyticsMetric, total: number): DonutChartSegment[] {
    if (metric === 'latency') {
      return [
        { label: '< 100ms', value: 42, color: '#16a34a' },
        { label: '100-300ms', value: 35, color: '#0f766e' },
        { label: '300-500ms', value: 15, color: '#f59e0b' },
        { label: '> 500ms', value: 8, color: '#dc2626' },
      ];
    }

    return [
      { label: 'Successful', value: Math.round(total * 0.78), color: '#16a34a' },
      { label: 'Client errors', value: Math.round(total * 0.14), color: '#f59e0b' },
      { label: 'Server errors', value: Math.round(total * 0.08), color: '#dc2626' },
    ];
  }
}
