import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCoreServices } from '@aether/core';
import { provideDataServices } from '@aether/data-services';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    ...provideCoreServices(),
    ...provideDataServices(),
  ],
};
