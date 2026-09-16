import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'ui-app-shell',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell">
      <header class="header">
        <button class="menu-btn" (click)="toggleSidebar()" aria-label="Toggle sidebar">☰</button>
        <div class="title">Aether Dashboard</div>
      </header>

      <div class="body">
        <aside class="sidebar" [class.open]="sidebarOpen">
          <nav>
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
            <a routerLink="/probes" routerLinkActive="active">Probes</a>
            <a routerLink="/analytics" routerLinkActive="active">Analytics</a>
            <a routerLink="/settings" routerLinkActive="active">Settings</a>
          </nav>
        </aside>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
    :host { display: block; height: 100vh; }
    .app-shell { display:flex; flex-direction:column; height:100%; }
    .header { height:56px; display:flex; align-items:center; gap:12px; padding:0 16px; background:#0f172a; color:white; }
    .menu-btn { background:transparent; border:none; color:inherit; font-size:20px; cursor:pointer; }
    .body { display:grid; grid-template-columns: 240px 1fr; flex:1; min-height:0; }
    .sidebar { background:#0b1220; color:#cbd5e1; padding:16px; overflow:auto; }
    .sidebar nav { display:flex; flex-direction:column; gap:8px; }
    .sidebar a { color:inherit; text-decoration:none; padding:8px; border-radius:6px; }
    .sidebar a.active { background:rgba(255,255,255,0.06); }
    .content { padding:16px; overflow:auto; background: #f8fafc; }

    /* Responsive: collapse sidebar on small screens */
    @media (max-width: 767px) {
      .body { grid-template-columns: 1fr; }
      .sidebar { position:fixed; top:56px; left:0; bottom:0; width:240px; transform:translateX(-100%); transition:transform .24s ease-in-out; z-index:30; }
      .sidebar.open { transform:translateX(0); }
      .content { padding:12px; }
    }
    `,
  ],
})
export class AppShellComponent {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
