import { Provider } from '@angular/core';
import { CoreFacade } from './core.facade';
import { MockAuthService } from './mock-auth.service';
import { SettingsFacade, SettingsService } from './settings.facade';

export const CORE_PROVIDERS: Provider[] = [
  SettingsService,
  SettingsFacade,
  MockAuthService,
  CoreFacade,
];

export function provideCoreServices(): Provider[] {
  return CORE_PROVIDERS;
}
