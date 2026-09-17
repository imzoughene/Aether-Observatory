import { Injectable, computed, inject, signal } from '@angular/core';
import { Kpi, KpiSeverity } from '@aether/data-models';
import { ApiClientError, KpisService } from '@aether/data-services';
import { DonutSegment } from '@aether/ui-charts';
import { BadgeVariant } from '@aether/ui-shared';

const SEVERITY_BADGE: Record<KpiSeverity, BadgeVariant> = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  neutral: 'default',
};

const PROBE_STATUS_COLORS: Record<string, string> = {
  Active: '#16a34a',
  Warning: '#d97706',
  Critical: '#dc2626',
};

@Injectable()
export class DashboardFacade {
  private readonly kpisService = inject(KpisService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly kpis = signal<Kpi[]>([]);

  readonly probeKpis = computed(() => this.kpis().filter((kpi) => kpi.category === 'probes'));

  readonly operationalKpis = computed(() =>
    this.kpis().filter((kpi) => kpi.category !== 'probes')
  );

  readonly healthScore = computed(() => {
    const uptime = this.kpis().find((kpi) => kpi.id === 'kpi-uptime')?.value ?? 0;
    const errorRate = this.kpis().find((kpi) => kpi.id === 'kpi-error-rate')?.value ?? 0;
    return Math.round(Math.max(0, Math.min(100, uptime - errorRate * 10)));
  });

  readonly requestVolume = computed(() => {
    const latency = this.kpis().find((kpi) => kpi.id === 'kpi-latency')?.value ?? 100;
    const errorRate = this.kpis().find((kpi) => kpi.id === 'kpi-error-rate')?.value ?? 1;
    const base = Math.max(latency / 4, 20);

    return [
      Math.round(base * 0.62),
      Math.round(base * 0.85),
      Math.round(base * 0.45),
      Math.round(base * 0.9),
      Math.round(base * 0.7),
      Math.round(base * 0.95),
      Math.round(base * (1 - errorRate / 20)),
    ];
  });

  readonly requestVolumeLabels = computed(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  readonly statusDistribution = computed<DonutSegment[]>(() => {
    const probeKpis = this.probeKpis().filter((kpi) => kpi.id !== 'kpi-total-probes');

    return probeKpis.map((kpi) => ({
      value: kpi.value,
      label: kpi.label,
      color: PROBE_STATUS_COLORS[kpi.label] ?? '#94a3b8',
    }));
  });

  readonly hasData = computed(() => this.kpis().length > 0);

  load(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.kpisService.list().subscribe({
      next: (items) => {
        this.kpis.set(items);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(this.toErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  refresh(): void {
    this.load();
  }

  badgeVariant(severity: KpiSeverity | undefined): BadgeVariant {
    return SEVERITY_BADGE[severity ?? 'neutral'];
  }

  displayValue(kpi: Kpi): string {
    return kpi.formattedValue ?? `${kpi.value}${kpi.unit ? ` ${kpi.unit}` : ''}`;
  }

  trendLabel(kpi: Kpi): string | null {
    if (!kpi.trend || kpi.trend === 'stable') {
      return kpi.trend === 'stable' ? 'Stable' : null;
    }

    const arrow = kpi.trend === 'up' ? '↑' : '↓';
    const percent = kpi.trendPercent != null ? ` ${kpi.trendPercent}%` : '';
    return `${arrow}${percent}`;
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof ApiClientError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unable to load dashboard KPIs.';
  }
}
