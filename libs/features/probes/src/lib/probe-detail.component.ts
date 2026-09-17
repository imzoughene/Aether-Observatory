import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiStateService } from '@aether/core';
import { Probe } from '@aether/data-models';
import { ProbesService } from '@aether/data-services';
import { ErrorStateComponent, LoadingIndicatorComponent } from '@aether/ui-shared';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ProbeDetailContext } from './probe-detail-context';

export type ProbeDetailState =
  { status: 'loading' } | { status: 'loaded'; probe: Probe } | { status: 'error'; message: string };

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorStateComponent,
    LoadingIndicatorComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  selector: 'aether-probe-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProbeDetailContext],
  template: `
    <section class="detail-page">
      <a routerLink="/probes" class="back-link">Back to probes</a>
      @if (detail$ | async; as state) {
        @switch (state.status) {
          @case ('loading') {
            <aether-loading-indicator label="Loading probe details..." />
          }
          @case ('error') {
            <aether-error-state
              title="Unable to load this probe"
              [message]="state.message"
              retryLabel="Refresh"
              (retry)="refresh()"
            />
          }
          @case ('loaded') {
            <header class="detail-header">
              <div>
                <p class="eyebrow">Probe detail</p>
                <h2>{{ state.probe.name }}</h2>
                <p class="target">{{ state.probe.target }}</p>
              </div>
              <button type="button" class="refresh-button" (click)="refresh()">Refresh</button>
            </header>
            <nav class="tabs" aria-label="Probe detail sections">
              <a
                routerLink="overview"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                >Overview</a
              >
              <a routerLink="telemetry" routerLinkActive="active">Telemetry</a>
              <a routerLink="logs" routerLinkActive="active">Logs</a>
              <a routerLink="actions" routerLinkActive="active">Actions</a>
              <a routerLink="configuration" routerLinkActive="active">Configuration</a>
            </nav>
            <router-outlet />
          }
        }
      }
    </section>
  `,
  styles: [
    `
      .detail-page {
        display: grid;
        gap: 16px;
      }
      .back-link,
      .tabs a {
        color: #0f766e;
        text-decoration: none;
      }
      .back-link {
        font-size: 13px;
      }
      .back-link:hover,
      .tabs a:hover {
        text-decoration: underline;
      }
      .detail-header,
      .tabs {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
      }
      .detail-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 24px;
      }
      .eyebrow {
        margin: 0 0 4px;
        color: #0f766e;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      h2 {
        margin: 0;
        color: #0f172a;
      }
      .target {
        margin: 8px 0 0;
        color: #64748b;
        word-break: break-all;
      }
      .tabs {
        display: flex;
        gap: 24px;
        padding: 0 20px;
      }
      .tabs a {
        padding: 15px 0 12px;
        border-bottom: 3px solid transparent;
        font-size: 14px;
      }
      .tabs a.active {
        border-bottom-color: #0f766e;
        font-weight: 700;
      }
      button {
        border: 0;
        border-radius: 5px;
        padding: 9px 14px;
        color: #fff;
        background: #0f766e;
        cursor: pointer;
        font: inherit;
        font-size: 13px;
      }
      @media (max-width: 540px) {
        .detail-header {
          align-items: flex-start;
          flex-direction: column;
        }
        .tabs {
          gap: 14px;
          overflow-x: auto;
        }
      }
    `,
  ],
})
export class ProbeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly probesService = inject(ProbesService);
  private readonly context = inject(ProbeDetailContext);
  private readonly uiState = inject(UiStateService);
  private readonly refresh$ = new Subject<void>();

  readonly detail$: Observable<ProbeDetailState> = combineLatest({
    id: this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    refresh: this.refresh$.pipe(startWith(undefined)),
  }).pipe(
    switchMap(({ id }) => {
      if (!id) {
        return of<ProbeDetailState>({ status: 'error', message: 'Probe id is missing.' });
      }
      return this.probesService.getById(id).pipe(
        tap((probe) => {
          this.context.probe.set(probe);
          this.uiState.selectProbe(probe.id);
        }),
        map((probe): ProbeDetailState => ({ status: 'loaded', probe })),
        startWith<ProbeDetailState>({ status: 'loading' }),
        catchError(() => {
          this.context.probe.set(null);
          this.uiState.selectProbe(null);
          return of<ProbeDetailState>({
            status: 'error',
            message: 'The probe could not be loaded. Please try again.',
          });
        })
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  refresh(): void {
    this.refresh$.next();
  }
}
