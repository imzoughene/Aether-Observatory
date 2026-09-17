import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProbesListQuery, ProbeSummary, SortParam } from '@aether/data-models';
import { ProbesService } from '@aether/data-services';
import { DataTableComponent, DataTableColumn, DataTableRow } from '@aether/ui-shared';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

@Component({
  standalone: true,
  imports: [AsyncPipe, DataTableComponent],
  selector: 'aether-probes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProbesService],
  template: `
    <section class="probes-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Infrastructure</p>
          <h2>Probes</h2>
          <p class="subtitle">Monitor every endpoint and connection from one place.</p>
        </div>
        @if (probes$ | async; as result) {
          <strong class="total">{{ result.total }} total</strong>
        }
      </header>

      <div class="workspace">
        <aside class="filters" aria-label="Probe filters">
          <div class="filter-heading">
            <h3>Filter probes</h3>
            <button type="button" class="clear-button" (click)="clearFilters()">Clear</button>
          </div>
          <label>
            Status
            <select [value]="statusFilter()" (change)="setFilter('status', $event)">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label>
            Mission type
            <select [value]="typeFilter()" (change)="setFilter('type', $event)">
              <option value="">All types</option>
              <option value="HTTP">HTTP</option>
              <option value="TCP">TCP</option>
              <option value="DNS">DNS</option>
              <option value="DB">Database</option>
              <option value="ICMP">ICMP</option>
            </select>
          </label>
          <label>
            Health
            <select [value]="healthFilter()" (change)="setFilter('health', $event)">
              <option value="">All health states</option>
              <option value="active">Healthy</option>
              <option value="warning">Degraded</option>
              <option value="error">Critical</option>
            </select>
          </label>
          <label>
            Sort by
            <select [value]="sortValue()" (change)="setSort(selectValue($event))">
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="status:asc">Status</option>
              <option value="lastCheckAt:desc">Last check (newest)</option>
            </select>
          </label>
        </aside>

        <div class="results">
          @if (probes$ | async; as result) {
            <div class="results-toolbar">
              <span>{{ result.items.length }} of {{ result.total }} probes</span>
              <div class="pagination">
                <button type="button" [disabled]="page() === 0" (click)="previousPage()">
                  Previous
                </button>
                <span>Page {{ page() + 1 }}</span>
                <button type="button" [disabled]="!result.hasMore" (click)="nextPage()">
                  Next
                </button>
              </div>
            </div>
            <ui-data-table [columns]="columns" [rows]="toRows(result.items)" />
          } @else {
            <p class="loading">Loading probes...</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .probes-page {
        display: grid;
        gap: 16px;
      }
      .page-header,
      .filters,
      .results {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      }
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 24px;
      }
      .eyebrow {
        margin: 0 0 4px;
        color: #0f766e;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h2 {
        margin: 0;
        color: #0f172a;
      }
      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 15px;
      }
      .subtitle {
        margin: 8px 0 0;
        color: #64748b;
      }
      .total {
        color: #0f766e;
        white-space: nowrap;
      }
      .workspace {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      .filters {
        display: grid;
        gap: 20px;
        padding: 20px;
      }
      .filter-heading,
      .results-toolbar,
      .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .clear-button {
        border: 0;
        padding: 0;
        color: #0f766e;
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: 12px;
      }
      label {
        display: grid;
        gap: 7px;
        color: #475569;
        font-size: 12px;
        font-weight: 700;
      }
      select {
        width: 100%;
        padding: 9px 10px;
        border: 1px solid #cbd5e1;
        border-radius: 5px;
        color: #1e293b;
        background: #fff;
        font: inherit;
        font-size: 13px;
      }
      .results {
        min-width: 0;
        overflow: hidden;
      }
      .results-toolbar {
        padding: 14px 16px;
        color: #64748b;
        font-size: 13px;
      }
      .pagination button {
        border: 1px solid #cbd5e1;
        border-radius: 5px;
        padding: 6px 9px;
        color: #334155;
        background: #fff;
        cursor: pointer;
        font: inherit;
        font-size: 12px;
      }
      .pagination button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .loading {
        padding: 32px;
        color: #64748b;
        text-align: center;
      }
      @media (max-width: 800px) {
        .workspace {
          grid-template-columns: 1fr;
        }
        .filters {
          grid-template-columns: repeat(3, 1fr);
        }
        .filter-heading {
          grid-column: 1/-1;
        }
      }
      @media (max-width: 540px) {
        .filters {
          grid-template-columns: 1fr;
        }
        .page-header {
          padding: 18px;
        }
      }
    `,
  ],
})
export class ProbesListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly probesService = inject(ProbesService);
  readonly statusFilter = signal('');
  readonly typeFilter = signal('');
  readonly healthFilter = signal('');
  readonly sort = signal<SortParam>({ field: 'name', direction: 'asc' });
  readonly page = signal(0);
  readonly pageSize = 20;
  readonly columns: readonly DataTableColumn[] = [
    { key: 'name', label: 'Probe' },
    { key: 'status', label: 'Status' },
    { key: 'health', label: 'Health' },
    { key: 'type', label: 'Mission type' },
    { key: 'region', label: 'Region' },
    { key: 'lastCheckAt', label: 'Last check' },
  ];

  private readonly filter$ = combineLatest({
    status: toObservable(this.statusFilter).pipe(startWith(''), distinctUntilChanged()),
    type: toObservable(this.typeFilter).pipe(startWith(''), distinctUntilChanged()),
    health: toObservable(this.healthFilter).pipe(startWith(''), distinctUntilChanged()),
    sort: toObservable(this.sort).pipe(
      startWith(this.sort()),
      distinctUntilChanged(
        (left, right) => left.field === right.field && left.direction === right.direction
      )
    ),
    page: toObservable(this.page).pipe(startWith(0), distinctUntilChanged()),
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly probes$ = combineLatest({
    query: this.route.queryParamMap.pipe(
      map((params) => params.get('search')?.trim() ?? ''),
      debounceTime(150),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    ),
    filter: this.filter$,
  }).pipe(
    switchMap(({ query, filter }) => {
      const status = filter.health || filter.status;
      const request: ProbesListQuery = {
        offset: filter.page * this.pageSize,
        limit: this.pageSize,
        search: query,
        sort: filter.sort,
        filter: JSON.stringify({
          ...(status ? { status } : {}),
          ...(filter.type ? { type: filter.type } : {}),
        }),
      };
      return this.probesService.list(request);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  sortValue(): string {
    return `${this.sort().field}:${this.sort().direction}`;
  }

  setSort(value: string): void {
    const [field, direction] = value.split(':');
    if ((direction === 'asc' || direction === 'desc') && field) {
      this.sort.set({ field, direction });
      this.page.set(0);
    }
  }

  setFilter(filter: 'status' | 'type' | 'health', event: Event): void {
    const value = this.selectValue(event);
    if (filter === 'status') {
      this.statusFilter.set(value);
    } else if (filter === 'type') {
      this.typeFilter.set(value);
    } else {
      this.healthFilter.set(value);
    }
    this.page.set(0);
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.typeFilter.set('');
    this.healthFilter.set('');
    this.page.set(0);
  }

  previousPage(): void {
    this.page.update((value) => Math.max(0, value - 1));
  }

  nextPage(): void {
    this.page.update((value) => value + 1);
  }

  toRows(items: readonly ProbeSummary[]): readonly DataTableRow[] {
    return items.map((probe) => ({
      name: probe.name,
      status: probe.status,
      health: this.healthLabel(probe.status),
      type: probe.type,
      region: probe.region ?? '-',
      lastCheckAt: probe.lastCheckAt ? new Date(probe.lastCheckAt).toLocaleString() : '-',
    }));
  }

  private healthLabel(status: ProbeSummary['status']): string {
    return { active: 'Healthy', warning: 'Degraded', error: 'Critical', inactive: 'Unknown' }[
      status
    ];
  }
}
