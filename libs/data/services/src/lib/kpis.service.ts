import { Inject, Injectable } from '@angular/core';
import { API_ENDPOINTS, Kpi, KpiCategory } from '@aether/data-models';
import { Observable } from 'rxjs';
import { API_CLIENT, ApiClient, ApiQueryParams } from './api-client';

export interface KpisListQuery {
  category?: KpiCategory;
}

@Injectable()
export class KpisService {
  constructor(@Inject(API_CLIENT) private readonly apiClient: ApiClient) {}

  list(query: KpisListQuery = {}): Observable<Kpi[]> {
    const params: ApiQueryParams = query.category ? { category: query.category } : {};
    return this.apiClient.get<Kpi[]>(API_ENDPOINTS.kpis, params);
  }
}
