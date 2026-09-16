import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-settings-placeholder',
  template: `
    <section>
      <h2>Settings</h2>
      <p>Placeholder for settings and configuration pages.</p>
    </section>
  `,
  styles: [
    `section { background:white; padding:16px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04);} h2{margin:0 0 8px}
    `,
  ],
})
export class SettingsPlaceholderComponent {}
