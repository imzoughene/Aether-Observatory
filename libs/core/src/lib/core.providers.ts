import { Provider } from '@angular/core';
import { CoreFacade } from './core.facade';
import { MockAuthService } from './mock-auth.service';
import { SettingsFacade, SettingsService } from './settings.facade';
import { UiStateService } from './ui-state.service';

export const CORE_PROVIDERS: Provider[] = [
  SettingsService,
  SettingsFacade,
  MockAuthService,
  CoreFacade,
  UiStateService,
];

export function provideCoreServices(): Provider[] {
  return CORE_PROVIDERS;
}
