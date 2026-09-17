import { Provider, Type } from '@angular/core';
import { API_CLIENT, ApiClient } from './api-client';
import { MockApiAdapter } from './mock-api.adapter';
import { KpisService } from './kpis.service';
import { ProbesService } from './probes.service';

export function provideDataServices(adapter: Type<ApiClient> = MockApiAdapter): Provider[] {
  return [{ provide: API_CLIENT, useClass: adapter }, ProbesService, KpisService];
}
