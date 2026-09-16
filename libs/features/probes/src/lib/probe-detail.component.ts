import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'aether-probe-detail',
  template: `
    <section>
      <div class="detail-header">
        <a routerLink="/probes" class="back-link">← Back to probes</a>
        <h2>Probe Details: {{ probeId }}</h2>
      </div>

      <div class="detail-grid">
        <div class="info-card">
          <h3>General Info</h3>
          <div class="info-row"><span class="label">Status</span><span class="value status-active">Active</span></div>
          <div class="info-row"><span class="label">Type</span><span class="value">HTTP</span></div>
          <div class="info-row"><span class="label">Interval</span><span class="value">30s</span></div>
          <div class="info-row"><span class="label">Timeout</span><span class="value">5s</span></div>
        </div>

        <div class="info-card">
          <h3>Latest Metrics</h3>
          <div class="info-row"><span class="label">Response Time</span><span class="value">124 ms</span></div>
          <div class="info-row"><span class="label">Uptime (24h)</span><span class="value">99.7%</span></div>
          <div class="info-row"><span class="label">Last Check</span><span class="value">2 min ago</span></div>
          <div class="info-row"><span class="label">Region</span><span class="value">us-east-1</span></div>
        </div>
      </div>

      <p class="hint">Probe detail feature module — lazy loaded with param :id.</p>
    </section>
  `,
  styles: [
    `
    section { background:white; padding:24px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    .detail-header { margin-bottom:24px; }
    .back-link { display:inline-block; color:#3b82f6; text-decoration:none; font-size:14px; margin-bottom:12px; }
    .back-link:hover { text-decoration:underline; }
    h2 { margin:0; color:#0f172a; }
    h3 { margin:0 0 16px; color:#0f172a; font-size:16px; }
    .detail-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:16px; }
    .info-card { padding:20px; border-radius:8px; background:#f8fafc; border:1px solid #e2e8f0; }
    .info-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e2e8f0; }
    .info-row:last-child { border-bottom:none; }
    .label { color:#64748b; }
    .value { font-weight:500; color:#0f172a; }
    .status-active { color:#16a34a; }
    .hint { color:#64748b; font-style:italic; margin:16px 0 0; }
    `,
  ],
})
export class ProbeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  probeId = '';

  ngOnInit(): void {
    this.probeId = this.route.snapshot.params['id'] ?? 'unknown';
  }
}
