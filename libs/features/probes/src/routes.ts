import { Route } from '@angular/router';
import { ProbesListComponent } from './lib/probes-list.component';
import { ProbeDetailComponent } from './lib/probe-detail.component';

export const probesRoutes: Route[] = [
  { path: '', component: ProbesListComponent },
  { path: ':id', component: ProbeDetailComponent },
];
