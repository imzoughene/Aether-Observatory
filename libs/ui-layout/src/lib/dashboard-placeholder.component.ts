import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-dashboard-placeholder',
  template: `
    <section>
      <h2>Dashboard</h2>
      <p>This is a placeholder dashboard view. Replace with real widgets.</p>
    </section>
  `,
  styles: [
    `section { background:white; padding:16px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04);} h2{margin:0 0 8px}
    `,
  ],
})
export class DashboardPlaceholderComponent {}
