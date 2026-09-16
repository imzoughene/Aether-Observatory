import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'aether-settings',
  template: `
    <section>
      <h2>Settings</h2>

      <div class="settings-group">
        <h3>General</h3>
        <div class="setting-row">
          <label>
            <span>Dark Mode</span>
            <input type="checkbox" [(ngModel)]="settings.darkMode" />
          </label>
        </div>
        <div class="setting-row">
          <label>
            <span>Auto-refresh Interval (s)</span>
            <input type="number" [(ngModel)]="settings.refreshInterval" min="5" max="300" />
          </label>
        </div>
      </div>

      <div class="settings-group">
        <h3>Notifications</h3>
        <div class="setting-row">
          <label>
            <span>Email Alerts</span>
            <input type="checkbox" [(ngModel)]="settings.emailAlerts" />
          </label>
        </div>
        <div class="setting-row">
          <label>
            <span>Push Notifications</span>
            <input type="checkbox" [(ngModel)]="settings.pushNotifications" />
          </label>
        </div>
      </div>

      <p class="hint">Settings feature module — lazy loaded.</p>
    </section>
  `,
  styles: [
    `
    section { background:white; padding:24px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    h2 { margin:0 0 24px; color:#0f172a; }
    h3 { margin:0 0 16px; color:#0f172a; font-size:16px; }
    .settings-group { padding:20px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:16px; }
    .setting-row { padding:12px 0; border-bottom:1px solid #f1f5f9; }
    .setting-row:last-child { border-bottom:none; }
    .setting-row label { display:flex; justify-content:space-between; align-items:center; cursor:pointer; }
    .setting-row span { color:#334155; }
    input[type="checkbox"] { width:18px; height:18px; accent-color:#3b82f6; }
    input[type="number"] { padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; width:100px; }
    .hint { color:#64748b; font-style:italic; margin:16px 0 0; }
    `,
  ],
})
export class SettingsComponent {
  settings = {
    darkMode: false,
    refreshInterval: 30,
    emailAlerts: true,
    pushNotifications: false,
  };
}
