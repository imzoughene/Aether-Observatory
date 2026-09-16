import { Component, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'ui-header',
  imports: [RouterLink],
  template: `
    <header class="header">
      <button class="menu-button" type="button" (click)="menuToggle.emit()" aria-label="Toggle sidebar">
        <span aria-hidden="true">&#9776;</span>
      </button>
      <a class="title" routerLink="/dashboard">Aether Dashboard</a>
      <label class="search">
        <span class="visually-hidden">Search</span>
        <input
          type="search"
          placeholder="Search"
          [value]="searchTerm()"
          (input)="updateSearch($event)"
        />
      </label>
      <button class="refresh-button" type="button" (click)="refresh.emit()" aria-label="Refresh dashboard">
        <span aria-hidden="true">&#8635;</span>
      </button>
      <div class="user-menu">
        <button
          class="user-button"
          type="button"
          (click)="userMenuOpen.update((open) => !open)"
          [attr.aria-expanded]="userMenuOpen()"
          aria-haspopup="menu"
        >
          Alex Morgan <span aria-hidden="true">&#9662;</span>
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
  styles: [`
    :host { display: block; }
    .header { height: 56px; display: flex; align-items: center; gap: 12px; padding: 0 16px; box-sizing: border-box; background: #0f172a; color: #fff; }
    button, input { font: inherit; }
    button { cursor: pointer; }
    .menu-button, .refresh-button, .user-button { border: 0; color: inherit; background: transparent; }
    .menu-button, .refresh-button { width: 32px; height: 32px; font-size: 20px; border-radius: 6px; }
    .menu-button:hover, .menu-button:focus-visible, .refresh-button:hover, .refresh-button:focus-visible, .user-button:focus-visible { background: rgba(255, 255, 255, .1); outline: 2px solid #93c5fd; outline-offset: 2px; }
    .title { color: inherit; text-decoration: none; font-weight: 700; white-space: nowrap; }
    .search { flex: 1; max-width: 420px; margin-left: auto; }
    .search input { width: 100%; box-sizing: border-box; border: 1px solid #475569; border-radius: 6px; padding: 8px 10px; background: #1e293b; color: #fff; }
    .search input::placeholder { color: #94a3b8; }
    .search input:focus { outline: 2px solid #93c5fd; outline-offset: 1px; }
    .user-menu { position: relative; }
    .user-button { padding: 8px; border-radius: 6px; white-space: nowrap; }
    .menu { position: absolute; top: calc(100% + 8px); right: 0; z-index: 40; display: grid; min-width: 140px; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; box-shadow: 0 8px 20px rgba(15, 23, 42, .2); }
    .menu button { border: 0; border-radius: 4px; padding: 8px; background: transparent; text-align: left; color: #0f172a; }
    .menu button:hover, .menu button:focus-visible { background: #e2e8f0; outline: none; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    @media (max-width: 600px) {
      .title { display: none; }
      .search { max-width: none; }
      .user-button { max-width: 32px; overflow: hidden; padding: 8px 0; }
    }
  `],
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
