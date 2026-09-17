import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProbeDetailContext } from './probe-detail-context';

const detailTabStyles = `
  article { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  h3 { margin: 0 0 16px; color: #0f172a; font-size: 16px; }
  dl { display: grid; grid-template-columns: minmax(100px, 1fr) minmax(0, 2fr); gap: 10px 16px; margin: 0; }
  dt { color: #64748b; } dd { margin: 0; color: #0f172a; font-weight: 600; overflow-wrap: anywhere; }
`;

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (probe(); as item) {
      <div class="detail-grid">
        <article>
          <h3>General information</h3>
          <dl>
            <dt>Status</dt>
            <dd>{{ item.status }}</dd>
            <dt>Type</dt>
            <dd>{{ item.type }}</dd>
            <dt>Region</dt>
            <dd>{{ item.region }}</dd>
            <dt>Target</dt>
            <dd>{{ item.target }}</dd>
          </dl>
        </article>
        <article>
          <h3>Check settings</h3>
          <dl>
            <dt>Interval</dt>
            <dd>{{ item.intervalSec }}s</dd>
            <dt>Timeout</dt>
            <dd>{{ item.timeoutSec }}s</dd>
            <dt>Last check</dt>
            <dd>{{ item.lastCheckAt | date: 'medium' }}</dd>
            <dt>Updated</dt>
            <dd>{{ item.updatedAt | date: 'medium' }}</dd>
          </dl>
        </article>
      </div>
    }
  `,
  styles: [detailTabStyles],
})
export class ProbeOverviewComponent {
  readonly probe = inject(ProbeDetailContext).probe;
}
