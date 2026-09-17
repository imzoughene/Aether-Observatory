import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '@aether/ui-shared';

type NavItem = {
  label: string;
  route: string;
  icon: IconName;
  exact?: boolean;
};

@Component({
  standalone: true,
  selector: 'ui-app-nav',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <nav aria-label="Primary navigation">
      @for (item of items; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          ariaCurrentWhenActive="page"
          [attr.aria-label]="item.label + ' navigation link'"
        >
          <aether-icon [name]="item.icon" [size]="18" />
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      nav {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      a {
        display: flex;
        align-items: center;
        gap: 10px;
        color: inherit;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 8px;
        transition:
          background-color var(--motion-fast) ease,
          color var(--motion-fast) ease,
          transform var(--motion-fast) ease;
      }
      a:hover,
      a:focus-visible {
        background: rgba(255, 255, 255, 0.12);
        outline: 2px solid #93c5fd;
        outline-offset: 2px;
        transform: translateX(2px);
      }
      a.active {
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        box-shadow: inset 3px 0 0 #67e8f9;
      }
    `,
  ],
})
export class AppNavComponent {
  readonly items: readonly NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', exact: true },
    { label: 'Probes', route: '/probes', icon: 'probes' },
    { label: 'Analytics', route: '/analytics', icon: 'analytics' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];
}
