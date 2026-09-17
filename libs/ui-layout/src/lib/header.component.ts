import { Component, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@aether/ui-shared';

@Component({
  standalone: true,
  selector: 'ui-header',
  imports: [RouterLink, IconComponent],
  template: `
    <header class="header">
      <button
        class="menu-button"
        type="button"
        (click)="menuToggle.emit()"
        aria-label="Toggle sidebar"
      >
        <aether-icon name="menu" [size]="19" />
      </button>
      <a class="title" routerLink="/dashboard">Aether Dashboard</a>
      <label class="search">
        <span class="visually-hidden">Search</span>
        <aether-icon name="search" [size]="17" />
        <input
          type="search"
          placeholder="Search"
          [value]="searchTerm()"
          (input)="updateSearch($event)"
        />
      </label>
      <button
        class="refresh-button"
        type="button"
        (click)="refresh.emit()"
        aria-label="Refresh dashboard"
      >
        <aether-icon name="refresh" [size]="18" />
      </button>
      <div class="user-menu">
        <button
          class="user-button"
          type="button"
          (click)="userMenuOpen.update((open) => !open)"
          [attr.aria-expanded]="userMenuOpen()"
          aria-haspopup="menu"
        >
          <aether-icon name="user" [size]="17" />
          <span class="user-name">Alex Morgan</span>
          <aether-icon name="chevron-right" [size]="15" />
        </button>
        @if (userMenuOpen()) {
          <div class="menu" role="menu">
            <button type="button" role="menuitem">Profile</button>
            <button type="button" role="menuitem">Sign out</button>
          </div>
        }
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .header {
        height: 60px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        box-sizing: border-box;
        background: #0f172a;
        color: #fff;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      button,
      input {
        font: inherit;
      }
      button {
        cursor: pointer;
      }
      .menu-button,
      .refresh-button,
      .user-button {
        border: 0;
        color: inherit;
        background: transparent;
      }
      .menu-button,
      .refresh-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        font-size: 20px;
        border-radius: 8px;
      }
      .menu-button:hover,
      .menu-button:focus-visible,
      .refresh-button:hover,
      .refresh-button:focus-visible,
      .user-button:focus-visible {
        background: rgba(255, 255, 255, 0.1);
        outline: 2px solid #93c5fd;
        outline-offset: 2px;
      }
      .title {
        color: inherit;
        text-decoration: none;
        font-weight: 700;
        white-space: nowrap;
      }
      .search {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        max-width: 420px;
        margin-left: auto;
        color: #94a3b8;
      }
      .search aether-icon {
        position: absolute;
        left: 11px;
        pointer-events: none;
      }
      .search input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #475569;
        border-radius: 8px;
        padding: 9px 10px 9px 35px;
        background: #1e293b;
        color: #fff;
        transition:
          border-color var(--motion-fast) ease,
          box-shadow var(--motion-fast) ease;
      }
      .search input::placeholder {
        color: #94a3b8;
      }
      .search input:focus {
        outline: none;
        border-color: #67e8f9;
        box-shadow: 0 0 0 3px rgba(103, 232, 249, 0.18);
      }
      .user-menu {
        position: relative;
      }
      .user-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px;
        border-radius: 8px;
        white-space: nowrap;
      }
      .user-button aether-icon:last-child {
        transition: transform var(--motion-fast) ease;
      }
      .user-button[aria-expanded='true'] aether-icon:last-child {
        transform: rotate(90deg);
      }
      .menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        z-index: 40;
        display: grid;
        min-width: 140px;
        padding: 6px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
      }
      .menu button {
        border: 0;
        border-radius: 4px;
        padding: 8px;
        background: transparent;
        text-align: left;
        color: #0f172a;
      }
      .menu button:hover,
      .menu button:focus-visible {
        background: #e2e8f0;
        outline: none;
      }
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      @media (max-width: 600px) {
        .title {
          display: none;
        }
        .search {
          max-width: none;
        }
        .user-name {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  readonly searchTerm = signal('');
  readonly userMenuOpen = signal(false);
  readonly menuToggle = output<void>();
  readonly refresh = output<void>();
  readonly searchChange = output<string>();

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }
}
