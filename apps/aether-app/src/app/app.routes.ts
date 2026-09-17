import { Route } from '@angular/router';
import { AppShellComponent } from '../../../../libs/ui-layout/src/index';
import { NotFoundComponent } from './not-found.component';

export const appRoutes: Route[] = [
	{
		path: '',
		component: AppShellComponent,
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{
				path: 'dashboard',
				loadChildren: () =>
					import('@aether/feature-dashboard').then((m) => m.dashboardRoutes),
			},
			{
				path: 'probes',
				loadChildren: () =>
					import('../../../../libs/features/probes/src/routes').then(
						(m) => m.probesRoutes
					),
			},
			{
				path: 'analytics',
				loadChildren: () =>
					import('../../../../libs/features/analytics/src/routes').then(
						(m) => m.analyticsRoutes
					),
			},
			{
				path: 'settings',
				loadChildren: () =>
					import('../../../../libs/features/settings/src/routes').then(
						(m) => m.settingsRoutes
					),
			},
		],
	},
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' },
];
