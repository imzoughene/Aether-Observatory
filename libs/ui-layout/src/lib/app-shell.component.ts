import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SearchService } from '@aether/core';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  standalone: true,
  selector: 'ui-app-shell',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  template: `
    <div class="app-shell">
      <ui-header (menuToggle)="sidebar.toggle()" (searchChange)="updateSearch($event)" />

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
      :host {
        display: block;
        height: 100vh;
      }
      .app-shell {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .body {
        display: grid;
        grid-template-columns: auto 1fr;
        flex: 1;
        min-height: 0;
      }
      .content {
        padding: 16px;
        overflow: auto;
        background: var(--color-bg);
      }

      @media (max-width: 767px) {
        .body {
          grid-template-columns: 1fr;
        }
        .content {
          padding: 12px;
        }
      }
    `,
  ],
})
export class AppShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((params) => this.searchService.setQuery(params.get('search') ?? ''));
  }

  updateSearch(search: string): void {
    this.searchService.setQuery(search);
    void this.router.navigate([], {
      queryParams: { search: search.trim() || null },
      queryParamsHandling: 'merge',
    });
  }
}
