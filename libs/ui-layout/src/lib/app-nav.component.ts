import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = {
  label: string;
  route: string;
  exact?: boolean;
};

@Component({
  standalone: true,
  selector: 'ui-app-nav',
  imports: [RouterLink, RouterLinkActive],
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
        gap: 8px;
      }
      a {
        display: block;
        color: inherit;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 6px;
      }
      a:hover,
      a:focus-visible {
        background: rgba(255, 255, 255, 0.12);
        outline: 2px solid #93c5fd;
        outline-offset: 2px;
      }
      a.active {
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
      }
    `,
  ],
})
export class AppNavComponent {
  readonly items: readonly NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', exact: true },
    { label: 'Probes', route: '/probes' },
    { label: 'Analytics', route: '/analytics' },
    { label: 'Settings', route: '/settings' },
  ];
}
