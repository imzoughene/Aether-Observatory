import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'activity'
  | 'analytics'
  | 'chevron-left'
  | 'chevron-right'
  | 'dashboard'
  | 'menu'
  | 'moon'
  | 'probes'
  | 'refresh'
  | 'search'
  | 'settings'
  | 'sun'
  | 'user';

@Component({
  selector: 'aether-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--icon-size]': 'size() + "px"',
  },
  template: `
    <svg
      [attr.aria-hidden]="decorative() ? 'true' : null"
      [attr.aria-label]="decorative() ? null : label()"
      [attr.role]="decorative() ? 'presentation' : 'img'"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      @switch (name()) {
        @case ('activity') {
          <path d="M3 12h4l3-8 4 16 3-8h4" />
        }
        @case ('analytics') {
          <path d="M4 19V5m0 14h16" />
          <path d="m7 15 3-4 3 2 5-6" />
        }
        @case ('chevron-left') {
          <path d="m15 18-6-6 6-6" />
        }
        @case ('chevron-right') {
          <path d="m9 18 6-6-6-6" />
        }
        @case ('dashboard') {
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        }
        @case ('menu') {
          <path d="M4 6h16M4 12h16M4 18h16" />
        }
        @case ('moon') {
          <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
        }
        @case ('probes') {
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        }
        @case ('refresh') {
          <path d="M20 11a8 8 0 0 0-14.6-3L4 10" />
          <path d="M4 5v5h5M4 13a8 8 0 0 0 14.6 3L20 14" />
          <path d="M20 19v-5h-5" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        }
        @case ('settings') {
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          <path
            d="m19 13.5 1.5 1-.9 1.7-1.8-.4a7.5 7.5 0 0 1-1.4 1.4l.4 1.8-1.7.9-1-1.5a7.5 7.5 0 0 1-2 .3l-1 1.5-1.7-.9.4-1.8a7.5 7.5 0 0 1-1.4-1.4l-1.8.4-.9-1.7 1.5-1a7.5 7.5 0 0 1 0-2l-1.5-1 .9-1.7 1.8.4a7.5 7.5 0 0 1 1.4-1.4l-.4-1.8 1.7-.9 1 1.5a7.5 7.5 0 0 1 2-.3l1-1.5 1.7.9-.4 1.8a7.5 7.5 0 0 1 1.4 1.4l1.8-.4.9 1.7-1.5 1a7.5 7.5 0 0 1 0 2Z"
          />
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="3.5" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        }
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: var(--icon-size, 20px);
        height: var(--icon-size, 20px);
        flex: 0 0 var(--icon-size, 20px);
        align-items: center;
        justify-content: center;
        vertical-align: middle;
      }

      svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }
    `,
  ],
})
export class IconComponent {
  readonly name = input<IconName>('activity');
  readonly size = input(20);
  readonly label = input('');
  readonly decorative = input(true);
}
