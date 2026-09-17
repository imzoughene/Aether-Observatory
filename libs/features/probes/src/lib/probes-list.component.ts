import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SearchService, UiStateService } from '@aether/core';
import { PaginatedResponse, ProbesListQuery, ProbeSummary } from '@aether/data-models';
import { ProbesService } from '@aether/data-services';
import {
  ErrorStateComponent,
  GenericTableComponent,
  LoadingIndicatorComponent,
  BadgeComponent,
  BadgeVariant,
  TableCellContext,
  TableColumn,
  TableSort,
} from '@aether/ui-shared';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

type ProbeListState =
  | { status: 'loading' }
  | { status: 'data'; data: PaginatedResponse<ProbeSummary> }
  | { status: 'error'; message: string };

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    BadgeComponent,
    ErrorStateComponent,
    GenericTableComponent,
    LoadingIndicatorComponent,
  ],
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
        @if (probes$ | async; as state) {
          @if (state.status === 'data') {
            <strong class="total">{{ state.data.total }} total</strong>
          }
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
            <select
              [value]="uiState.currentFilters().status"
              (change)="setFilter('status', $event)"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label>
            Mission type
            <select [value]="uiState.currentFilters().type" (change)="setFilter('type', $event)">
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
            <select
              [value]="uiState.currentFilters().health"
              (change)="setFilter('health', $event)"
            >
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
          @if (probes$ | async; as state) {
            @switch (state.status) {
              @case ('loading') {
                <aether-loading-indicator variant="skeleton" label="Loading probes..." />
              }
              @case ('error') {
                <aether-error-state
                  title="Unable to load probes"
                  [message]="state.message"
                  retryLabel="Retry"
                  (retry)="refresh()"
                />
              }
              @case ('data') {
                @let result = state.data;
                <div class="results-toolbar">
                  <span>{{ result.items.length }} of {{ result.total }} probes</span>
                  <div class="pagination">
                    <button
                      type="button"
                      [disabled]="uiState.currentFilters().page === 0"
                      (click)="previousPage()"
                    >
                      Previous
                    </button>
                    <span>Page {{ uiState.currentFilters().page + 1 }}</span>
                    <button type="button" [disabled]="!result.hasMore" (click)="nextPage()">
                      Next
                    </button>
                  </div>
                </div>
                <ng-template #healthCell let-value="value">
                  <aether-badge [variant]="healthBadgeVariant(value)" size="sm" [dot]="true">
                    {{ healthStatusCode(value) }}
                  </aether-badge>
                </ng-template>
                <ui-generic-table
                  [columns]="columns()"
                  [rows]="result.items"
                  [sort]="sortState()"
                  [rowActions]="rowActions"
                  emptyMessage="No probes match these filters."
                  (sortChange)="setTableSort($event)"
                  (rowSelected)="selectProbe($event)"
                  (action)="handleAction($event)"
                />
              }
            }
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
  private readonly probesService = inject(ProbesService);
  private readonly searchService = inject(SearchService);
  readonly uiState = inject(UiStateService);
  readonly pageSize = 20;
  private readonly refresh$ = new Subject<void>();
  private readonly healthCell =
    viewChild<TemplateRef<TableCellContext<ProbeSummary>>>('healthCell');
  readonly rowActions = [{ label: 'Open', action: 'open' }] as const;
  readonly columns = computed<readonly TableColumn<ProbeSummary>[]>(() => [
    { key: 'name', label: 'Probe', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    {
      key: 'status',
      label: 'Health',
      cellTemplate: this.healthCell(),
      value: (probe) => this.healthLabel(probe.status),
    },
    { key: 'type', label: 'Mission type' },
    { key: 'region', label: 'Region', value: (probe) => probe.region ?? '-' },
    {
      key: 'lastCheckAt',
      label: 'Last check',
      sortable: true,
      value: (probe) => (probe.lastCheckAt ? new Date(probe.lastCheckAt).toLocaleString() : '-'),
    },
  ]);

  private readonly filter$ = toObservable(this.uiState.currentFilters).pipe(
    startWith(this.uiState.currentFilters()),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly probes$: Observable<ProbeListState> = combineLatest({
    query: this.searchService.query$,
    filter: this.filter$,
    refresh: this.refresh$.pipe(startWith(undefined)),
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
      return this.probesService.list(request).pipe(
        map((data): ProbeListState => ({ status: 'data', data })),
        startWith<ProbeListState>({ status: 'loading' }),
        catchError(() =>
          of<ProbeListState>({
            status: 'error',
            message: 'The probes could not be loaded. Please try again.',
          })
        )
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  refresh(): void {
    this.refresh$.next();
  }

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  sortValue(): string {
    const sort = this.uiState.currentFilters().sort;
    return `${sort.field}:${sort.direction}`;
  }

  setSort(value: string): void {
    const [field, direction] = value.split(':');
    if ((direction === 'asc' || direction === 'desc') && field) {
      this.uiState.setSort({ field, direction });
    }
  }

  setFilter(filter: 'status' | 'type' | 'health', event: Event): void {
    const value = this.selectValue(event);
    this.uiState.setFilter(filter, value);
  }

  clearFilters(): void {
    this.uiState.clearFilters();
  }

  previousPage(): void {
    this.uiState.setPage(this.uiState.currentFilters().page - 1);
  }

  nextPage(): void {
    this.uiState.setPage(this.uiState.currentFilters().page + 1);
  }

  sortState(): TableSort<ProbeSummary> | null {
    const sort = this.uiState.currentFilters().sort;
    if (!['name', 'status', 'lastCheckAt'].includes(sort.field)) return null;
    return { key: sort.field as TableSort<ProbeSummary>['key'], direction: sort.direction };
  }

  setTableSort(sort: TableSort<ProbeSummary>): void {
    this.uiState.setSort({ field: sort.key, direction: sort.direction });
  }

  selectProbe(probe: ProbeSummary): void {
    this.uiState.selectProbe(probe.id);
  }

  healthLabel(status: ProbeSummary['status']): string {
    return { active: 'Healthy', warning: 'Degraded', error: 'Critical', inactive: 'Unknown' }[
      status
    ];
  }

  healthStatusCode(label: string): string {
    return { Healthy: 'OK', Degraded: 'WARN', Critical: 'CRIT', Unknown: 'INFO' }[label] ?? 'INFO';
  }

  healthBadgeVariant(label: string): BadgeVariant {
    return { Healthy: 'success', Degraded: 'warning', Critical: 'danger', Unknown: 'default' }[
      label
    ] as BadgeVariant;
  }

  handleAction(event: { action: string; row: ProbeSummary }): void {
    if (event.action === 'open') this.selectProbe(event.row);
  }
}
