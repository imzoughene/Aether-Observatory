import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreFacade } from '@aether/core';
import {
  CardComponent,
  ErrorStateComponent,
  KpiCardComponent,
  SkeletonCardComponent,
} from '@aether/ui-shared';
import { MiniBarChartComponent, MiniDonutChartComponent } from '@aether/ui-charts';
import { DashboardFacade } from './dashboard.facade';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    KpiCardComponent,
    SkeletonCardComponent,
    ErrorStateComponent,
    MiniBarChartComponent,
    MiniDonutChartComponent,
  ],
  providers: [DashboardFacade],
  selector: 'aether-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dashboard-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Overview</p>
          <h2>Dashboard</h2>
          <p class="subtitle">Welcome back, {{ core.user().name }}.</p>
        </div>
        <div class="health-score">
          <span class="health-label">Health score</span>
          <strong>{{ dashboard.healthScore() }}%</strong>
        </div>
      </header>

      @if (dashboard.loading() && !dashboard.hasData()) {
        <div class="kpi-grid">
          @for (placeholder of skeletonSlots; track placeholder) {
            <aether-skeleton-card [header]="false" [avatar]="false" [bodyLines]="2" />
          }
        </div>
      } @else if (dashboard.error()) {
        <aether-error-state
          title="Dashboard unavailable"
          [message]="dashboard.error() ?? ''"
          retryLabel="Reload dashboard"
          (retry)="dashboard.refresh()"
        />
      } @else {
        <div class="kpi-grid">
          @for (kpi of dashboard.kpis(); track kpi.id) {
            <aether-kpi-card [kpi]="kpi" />
          }
        </div>

        <div class="chart-grid">
          <aether-card variant="default" padding="lg" [header]="true">
            <div cardHeader class="chart-header">
              <h3>Request Volume</h3>
              <span class="chart-meta">Last 7 days</span>
            </div>
            <aether-mini-bar-chart
              [values]="dashboard.requestVolume()"
              [labels]="dashboard.requestVolumeLabels()"
            />
          </aether-card>

          <aether-card variant="default" padding="lg" [header]="true">
            <div cardHeader class="chart-header">
              <h3>Probe Status</h3>
              <span class="chart-meta">Live distribution</span>
            </div>
            <aether-mini-donut-chart [segments]="dashboard.statusDistribution()" />
          </aether-card>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .dashboard-page {
        display: grid;
        gap: 24px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
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

      .health-score {
        display: grid;
        gap: 4px;
        text-align: right;
      }

      .health-label {
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .health-score strong {
        font-size: 32px;
        color: #16a34a;
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
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
export class DashboardPageComponent implements OnInit {
  readonly dashboard = inject(DashboardFacade);
  readonly core = inject(CoreFacade);

  readonly skeletonSlots = [1, 2, 3, 4, 5, 6, 7];

  ngOnInit(): void {
    this.dashboard.load();
  }
}
