import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'aether-probes-list',
  template: `
    <section>
      <h2>Probes</h2>
      <div class="probes-list">
        @for (probe of probes; track probe.id) {
          <a [routerLink]="['/probes', probe.id]" class="probe-card">
            <div class="probe-header">
              <span class="probe-name">{{ probe.name }}</span>
              <span class="probe-status" [class]="probe.status">{{ probe.status }}</span>
            </div>
            <div class="probe-meta">
              <span>ID: {{ probe.id }}</span>
              <span>{{ probe.type }}</span>
            </div>
          </a>
        }
      </div>
      <p class="hint">Probes list feature module — lazy loaded.</p>
    </section>
  `,
  styles: [
    `
    section { background:white; padding:24px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    h2 { margin:0 0 20px; color:#0f172a; }
    .probes-list { display:flex; flex-direction:column; gap:12px; margin-bottom:16px; }
    .probe-card { display:block; padding:16px; border-radius:8px; border:1px solid #e2e8f0; text-decoration:none; color:inherit; transition:all .2s; }
    .probe-card:hover { border-color:#3b82f6; background:#f0f9ff; }
    .probe-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .probe-name { font-weight:600; color:#0f172a; }
    .probe-status { padding:2px 10px; border-radius:999px; font-size:12px; font-weight:500; }
    .probe-status.active { background:#dcfce7; color:#166534; }
    .probe-status.warning { background:#fef3c7; color:#92400e; }
    .probe-status.error { background:#fee2e2; color:#991b1b; }
    .probe-meta { display:flex; gap:16px; font-size:13px; color:#64748b; }
    .hint { color:#64748b; font-style:italic; margin:16px 0 0; }
    `,
  ],
})
export class ProbesListComponent {
  probes = [
    { id: 'probe-001', name: 'US-East Health Check', status: 'active', type: 'HTTP' },
    { id: 'probe-002', name: 'EU-Central API Monitor', status: 'active', type: 'TCP' },
    { id: 'probe-003', name: 'AP-South DNS Check', status: 'warning', type: 'DNS' },
    { id: 'probe-004', name: 'Database Replication', status: 'error', type: 'DB' },
  ];
}
