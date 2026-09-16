import { Route } from '@angular/router';
import {
	AppShellComponent,
	DashboardPlaceholderComponent,
	SettingsPlaceholderComponent,
} from '../../../../libs/ui-layout/src/index';

export const appRoutes: Route[] = [
	{
		path: '',
		component: AppShellComponent,
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardPlaceholderComponent },
			{ path: 'settings', component: SettingsPlaceholderComponent },
		],
	},
	{ path: '**', redirectTo: '' },
];
