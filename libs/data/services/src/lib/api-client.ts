import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type ApiQueryParams = Readonly<object>;

/** Transport boundary shared by real and mock API implementations. */
export abstract class ApiClient {
  abstract get<T>(path: string, params?: ApiQueryParams): Observable<T>;
}

export const API_CLIENT = new InjectionToken<ApiClient>('AETHER_API_CLIENT');

export interface ApiClientErrorDetails {
  statusCode: number;
  path: string;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly details: ApiClientErrorDetails
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}
