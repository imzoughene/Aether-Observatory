import { Inject, Injectable } from '@angular/core';
import {
  API_ENDPOINTS,
  PaginatedResponse,
  Probe,
  ProbeSummary,
  ProbesListQuery,
} from '@aether/data-models';
import { Observable, defer, delay, map, switchMap, throwError } from 'rxjs';
import { API_CLIENT, ApiClient } from './api-client';

export interface ProbeConfiguration {
  name: string;
  type: Probe['type'];
  target: string;
  region: string;
  intervalSec: number;
  timeoutSec: number;
}

@Injectable()
export class ProbesService {
  constructor(@Inject(API_CLIENT) private readonly apiClient: ApiClient) {}

  list(query: ProbesListQuery = {}): Observable<PaginatedResponse<ProbeSummary>> {
    return this.apiClient.get<PaginatedResponse<ProbeSummary>>(API_ENDPOINTS.probes, query);
  }

  listFrom(query$: Observable<ProbesListQuery>): Observable<PaginatedResponse<ProbeSummary>> {
    return query$.pipe(switchMap((query) => this.list(query)));
  }

  getById(id: string): Observable<Probe> {
    return this.apiClient.get<Probe>(API_ENDPOINTS.probeById(id));
  }

  nameExists(name: string, excludeId?: string): Observable<boolean> {
    return this.list().pipe(
      map((response) =>
        response.items.some(
          (probe) =>
            probe.id !== excludeId && probe.name.toLowerCase() === name.trim().toLowerCase()
        )
      )
    );
  }

  update(id: string, configuration: ProbeConfiguration): Observable<Probe> {
    return defer(() => {
      if (configuration.target.trim().toLowerCase() === 'simulate-error') {
        return throwError(() => new Error('The mock save service rejected this configuration.'));
      }

      return this.getById(id).pipe(
        map((probe) => ({
          ...probe,
          ...configuration,
          updatedAt: new Date().toISOString(),
        }))
      );
    }).pipe(delay(400));
  }
}
