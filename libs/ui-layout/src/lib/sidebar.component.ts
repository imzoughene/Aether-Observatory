import { Component, inject } from '@angular/core';
import { UiStateService } from '@aether/core';
import { AppNavComponent } from './app-nav.component';

@Component({
  standalone: true,
  selector: 'ui-sidebar',
  imports: [AppNavComponent],
  host: {
    '[class.expanded]': 'uiState.sidebarOpen()',
    '[class.collapsed]': '!uiState.sidebarOpen()',
  },
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-label">Workspace</span>
        <button
          class="collapse-button"
          type="button"
          (click)="toggle()"
          [attr.aria-expanded]="uiState.sidebarOpen()"
          aria-controls="primary-navigation"
          aria-label="Toggle sidebar"
        >
          <span aria-hidden="true">{{ uiState.sidebarOpen() ? '<' : '>' }}</span>
        </button>
      </div>
      <div
        id="primary-navigation"
        class="navigation"
        [attr.inert]="!uiState.sidebarOpen() ? '' : null"
      >
        <ui-app-nav />
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: 240px;
        transition: width 0.2s ease;
      }
      :host.collapsed {
        width: 72px;
      }
      .sidebar {
        height: 100%;
        box-sizing: border-box;
        background: #0b1220;
        color: #cbd5e1;
        padding: 16px 12px;
        overflow: auto;
      }
      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 16px;
      }
      .sidebar-label {
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .collapse-button {
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 6px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }
      .collapse-button:hover,
      .collapse-button:focus-visible {
        background: rgba(255, 255, 255, 0.1);
        outline: 2px solid #93c5fd;
        outline-offset: 2px;
      }
      .navigation {
        min-width: 0;
      }
      :host.collapsed .sidebar-label {
        display: none;
      }
      :host.collapsed .sidebar-header {
        justify-content: center;
      }
      :host.collapsed .navigation {
        display: none;
      }
      @media (max-width: 767px) {
        :host,
        :host.collapsed {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          z-index: 30;
          width: 240px;
          transform: translateX(-100%);
          transition: transform 0.2s ease;
        }
        :host.expanded {
          transform: translateX(0);
        }
        :host.collapsed .sidebar-label,
        :host.collapsed .navigation {
          display: initial;
        }
        :host.collapsed .sidebar-header {
          justify-content: space-between;
        }
        .sidebar {
          padding: 16px;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  readonly uiState = inject(UiStateService);

  toggle(): void {
    this.uiState.toggleSidebar();
  }
}
