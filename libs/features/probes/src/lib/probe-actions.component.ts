import { Component } from '@angular/core';

const detailTabStyles = `
  article { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  h3 { margin: 0 0 16px; color: #0f172a; font-size: 16px; }
  p { margin: 0 0 16px; color: #64748b; }
`;

@Component({
  standalone: true,
  template: `<article class="empty-panel">
    <h3>Actions</h3>
    <p>Probe actions will be available here.</p>
    <button type="button" disabled>Run check</button>
  </article>`,
  styles: [detailTabStyles],
})
export class ProbeActionsComponent {}
