import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'aether-analytics',
  template: `
    <section>
      <h2>Analytics</h2>
      <div class="chart-grid">
        <div class="chart-card">
          <h3>Request Volume</h3>
          <div class="chart-placeholder">
            <div class="bars">
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 85%"></div>
              <div class="bar" style="height: 45%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 95%"></div>
              <div class="bar" style="height: 55%"></div>
            </div>
          </div>
        </div>
        <div class="chart-card">
          <h3>Response Time Distribution</h3>
          <div class="chart-placeholder">
            <div class="donut"></div>
          </div>
        </div>
      </div>
      <p class="hint">Analytics feature module — lazy loaded.</p>
    </section>
  `,
  styles: [
    `
    section { background:white; padding:24px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    h2 { margin:0 0 20px; color:#0f172a; }
    h3 { margin:0 0 16px; color:#0f172a; font-size:16px; }
    .chart-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:16px; margin-bottom:16px; }
    .chart-card { padding:20px; border-radius:8px; border:1px solid #e2e8f0; }
    .chart-placeholder { height:200px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:6px; }
    .bars { display:flex; align-items:flex-end; gap:8px; height:160px; width:80%; }
    .bar { flex:1; background:linear-gradient(to top, #3b82f6, #60a5fa); border-radius:4px 4px 0 0; transition:height .3s; }
    .donut { width:140px; height:140px; border-radius:50%; background:conic-gradient(#3b82f6 0% 60%, #10b981 60% 85%, #f59e0b 85% 95%, #ef4444 95% 100%); position:relative; }
    .donut::after { content:''; position:absolute; inset:20px; background:white; border-radius:50%; }
    .hint { color:#64748b; font-style:italic; margin:16px 0 0; }
    `,
  ],
})
export class AnalyticsComponent {}
