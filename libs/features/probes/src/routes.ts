import { Route } from '@angular/router';
import { ProbesListComponent } from './lib/probes-list.component';
import { ProbeDetailComponent } from './lib/probe-detail.component';
import { ProbeExistsGuard } from './lib/probe-exists.guard';

export const probesRoutes: Route[] = [
  { path: '', component: ProbesListComponent },
  {
    path: ':id',
    component: ProbeDetailComponent,
    canActivate: [ProbeExistsGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./lib/probe-overview.component').then((m) => m.ProbeOverviewComponent),
      },
      {
        path: 'telemetry',
        loadComponent: () =>
          import('./lib/probe-telemetry.component').then((m) => m.ProbeTelemetryComponent),
      },
      {
        path: 'logs',
        loadComponent: () => import('./lib/probe-logs.component').then((m) => m.ProbeLogsComponent),
      },
      {
        path: 'actions',
        loadComponent: () =>
          import('./lib/probe-actions.component').then((m) => m.ProbeActionsComponent),
      },
    ],
  },
];
