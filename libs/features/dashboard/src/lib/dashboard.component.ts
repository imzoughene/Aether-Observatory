import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'aether-dashboard',
  template: `
    <section>
      <h2>Dashboard</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Probes</div>
          <div class="stat-value">24</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active</div>
          <div class="stat-value success">18</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Warning</div>
          <div class="stat-value warning">4</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Critical</div>
          <div class="stat-value error">2</div>
        </div>
      </div>
      <p class="hint">Dashboard feature module — lazy loaded.</p>
    </section>
  `,
  styles: [
    `
      section {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      h2 {
        margin: 0 0 20px;
        color: #0f172a;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }
      .stat-card {
        padding: 16px;
        border-radius: 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }
      .stat-label {
        font-size: 13px;
        color: #64748b;
        margin-bottom: 6px;
      }
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #0f172a;
      }
      .stat-value.success {
        color: #16a34a;
      }
      .stat-value.warning {
        color: #d97706;
      }
      .stat-value.error {
        color: #dc2626;
      }
      .hint {
        color: #64748b;
        font-style: italic;
        margin: 16px 0 0;
      }
    `,
  ],
})
export class DashboardComponent {}
