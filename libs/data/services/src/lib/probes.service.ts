import { Inject, Injectable } from '@angular/core';
import {
  API_ENDPOINTS,
  PaginatedResponse,
  Probe,
  ProbeSummary,
  ProbesListQuery,
} from '@aether/data-models';
import { Observable, switchMap } from 'rxjs';
import { API_CLIENT, ApiClient } from './api-client';

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
}
