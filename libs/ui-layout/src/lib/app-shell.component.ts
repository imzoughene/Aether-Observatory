import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  standalone: true,
  selector: 'ui-app-shell',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  template: `
    <div class="app-shell">
      <ui-header (menuToggle)="sidebar.toggle()" />

      <div class="body">
        <ui-sidebar #sidebar />

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
    .body { display:grid; grid-template-columns: auto 1fr; flex:1; min-height:0; }
    .content { padding:16px; overflow:auto; background: #f8fafc; }

    @media (max-width: 767px) {
      .body { grid-template-columns: 1fr; }
      .content { padding:12px; }
    }
    `,
  ],
})
export class AppShellComponent {}
