import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

export type KpiCardTrend = 'up' | 'down' | 'stable';
export type KpiCardSeverity = 'success' | 'warning' | 'error' | 'neutral';

export interface KpiCardData {
  label: string;
  value: number;
  unit?: string;
  formattedValue?: string;
  trend?: KpiCardTrend;
  trendPercent?: number;
  severity?: KpiCardSeverity;
  category: string;
}

@Component({
  selector: 'aether-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="kpi-card" [attr.aria-label]="kpi().label">
      <div class="kpi-header">
        <span class="kpi-label">{{ kpi().label }}</span>
        <span class="kpi-category">{{ kpi().category }}</span>
      </div>

      <div class="kpi-value" [class]="severity()">{{ displayValue() }}</div>

      <div class="kpi-footer">
        <span class="kpi-trend" [class]="trend()">{{ trendLabel() }}</span>
        <span class="kpi-average">Avg {{ rollingAverage() }}</span>
      </div>

      <svg
        class="sparkline"
        viewBox="0 0 100 28"
        role="img"
        [attr.aria-label]="'Recent trend for ' + kpi().label"
      >
        <polyline [attr.points]="sparklinePoints()" fill="none" />
      </svg>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .kpi-card {
        display: grid;
        gap: 10px;
        min-height: 142px;
        padding: 18px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      }

      .kpi-header,
      .kpi-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .kpi-label,
      .kpi-category,
      .kpi-average {
        color: #64748b;
        font-size: 12px;
      }

      .kpi-category {
        text-transform: capitalize;
      }

      .kpi-value {
        color: #0f172a;
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
      }

      .kpi-value.success {
        color: #16a34a;
      }
      .kpi-value.warning {
        color: #d97706;
      }
      .kpi-value.error {
        color: #dc2626;
      }

      .kpi-trend {
        font-size: 12px;
        font-weight: 600;
      }

      .kpi-trend.up {
        color: #16a34a;
      }
      .kpi-trend.down {
        color: #dc2626;
      }
      .kpi-trend.stable {
        color: #64748b;
      }

      .sparkline {
        width: 100%;
        height: 28px;
        overflow: visible;
      }

      .sparkline polyline {
        stroke: #0f766e;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `,
  ],
})
export class KpiCardComponent {
  readonly kpi = input.required<KpiCardData>();
  private readonly samples = signal<number[]>([]);

  readonly severity = computed<KpiCardSeverity>(() => this.kpi().severity ?? 'neutral');
  readonly trend = computed<KpiCardTrend>(() => this.kpi().trend ?? 'stable');
  readonly displayValue = computed(
    () =>
      this.kpi().formattedValue ??
      `${this.kpi().value}${this.kpi().unit ? ` ${this.kpi().unit}` : ''}`
  );
  readonly trendLabel = computed(() => {
    const currentKpi = this.kpi();
    if (!currentKpi.trend || currentKpi.trend === 'stable') {
      return currentKpi.trend === 'stable' ? 'Stable' : 'No change';
    }

    const arrow = currentKpi.trend === 'up' ? '↑' : '↓';
    return `${arrow}${currentKpi.trendPercent != null ? ` ${currentKpi.trendPercent}%` : ''}`;
  });
  readonly rollingAverage = computed(() => {
    const values = this.samples();
    if (!values.length) {
      return this.kpi().value;
    }

    return (
      Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10
    );
  });
  readonly sparklinePoints = computed(() => {
    const values = this.samples();
    if (values.length < 2) {
      return '0,14 100,14';
    }

    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    return values
      .map(
        (value, index) =>
          `${Math.round((index / (values.length - 1)) * 100)},${Math.round(24 - ((value - min) / range) * 20)}`
      )
      .join(' ');
  });

  constructor() {
    effect(() => {
      const value = this.kpi().value;
      this.samples.update((values) => [...values.slice(-6), value]);
    });
  }
}
