import { Injectable } from '@angular/core';
import {
  API_ENDPOINTS,
  ApiErrorResponse,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  FilterParams,
  MAX_PAGE_LIMIT,
  PaginatedResponse,
  Probe,
  ProbeSummary,
  ProbesListQuery,
  SortDirection,
} from '@aether/data-models';
import { Observable, defer, delay, throwError } from 'rxjs';
import { ApiClient, ApiClientError, ApiQueryParams } from './api-client';

export interface MockApiOptions {
  latencyMs?: number;
  errorRate?: number;
}

const PROBES: Probe[] = [
  {
    id: 'probe-001',
    name: 'Public API',
    status: 'active',
    type: 'HTTP',
    target: 'https://api.aether.io/health',
    region: 'eu-west-1',
    intervalSec: 60,
    timeoutSec: 10,
    lastCheckAt: '2026-09-17T09:45:00Z',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-09-17T09:45:00Z',
  },
  {
    id: 'probe-002',
    name: 'Payments TCP',
    status: 'warning',
    type: 'TCP',
    target: 'payments.aether.io:443',
    region: 'us-east-1',
    intervalSec: 30,
    timeoutSec: 5,
    lastCheckAt: '2026-09-17T09:42:00Z',
    createdAt: '2026-02-04T10:30:00Z',
    updatedAt: '2026-09-17T09:42:00Z',
  },
  {
    id: 'probe-003',
    name: 'Primary DNS',
    status: 'active',
    type: 'DNS',
    target: 'dns.aether.io',
    region: 'ap-southeast-1',
    intervalSec: 120,
    timeoutSec: 8,
    lastCheckAt: '2026-09-17T09:40:00Z',
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-09-17T09:40:00Z',
  },
  {
    id: 'probe-004',
    name: 'Legacy Database',
    status: 'error',
    type: 'DB',
    target: 'postgres.internal:5432',
    region: 'eu-central-1',
    intervalSec: 60,
    timeoutSec: 10,
    lastCheckAt: '2026-09-17T09:31:00Z',
    createdAt: '2026-03-09T11:15:00Z',
    updatedAt: '2026-09-17T09:31:00Z',
  },
  {
    id: 'probe-005',
    name: 'Mobile Gateway',
    status: 'inactive',
    type: 'HTTP',
    target: 'https://mobile.aether.io/status',
    region: 'us-west-2',
    intervalSec: 300,
    timeoutSec: 15,
    lastCheckAt: '2026-09-16T19:00:00Z',
    createdAt: '2026-04-18T09:20:00Z',
    updatedAt: '2026-09-16T19:00:00Z',
  },
];

@Injectable()
export class MockApiAdapter extends ApiClient {
  private latencyMs = 250;
  private errorRate = 0;

  configure(options: MockApiOptions): void {
    this.latencyMs = Math.max(0, options.latencyMs ?? this.latencyMs);
    this.errorRate = Math.min(1, Math.max(0, options.errorRate ?? this.errorRate));
  }

  override get<T>(path: string, params: ApiQueryParams = {}): Observable<T> {
    return defer(() => {
      if (Math.random() < this.errorRate) {
        const response: ApiErrorResponse = {
          statusCode: 503,
          message: 'Mock service temporarily unavailable',
          error: 'SERVICE_UNAVAILABLE',
        };
        return throwError(
          () =>
            new ApiClientError(response.message, {
              statusCode: response.statusCode,
              path,
            })
        );
      }

      return this.resolve<T>(path, params);
    }).pipe(delay(this.latencyMs));
  }

  private resolve<T>(path: string, params: ApiQueryParams): Observable<T> {
    if (path === API_ENDPOINTS.probes) {
      return new Observable<T>((subscriber) => {
        subscriber.next(this.listProbes(params as ProbesListQuery) as T);
        subscriber.complete();
      });
    }

    const probeId = path.match(/^\/api\/v1\/probes\/([^/]+)$/)?.[1];
    if (probeId) {
      const probe = PROBES.find((item) => item.id === probeId);
      if (!probe) {
        return throwError(
          () =>
            new ApiClientError('Probe not found', {
              statusCode: 404,
              path,
            })
        );
      }
      return new Observable<T>((subscriber) => {
        subscriber.next({ ...probe } as T);
        subscriber.complete();
      });
    }

    return throwError(
      () =>
        new ApiClientError('Mock endpoint not found', {
          statusCode: 404,
          path,
        })
    );
  }

  private listProbes(query: FilterParams): PaginatedResponse<ProbeSummary> {
    const filtered = PROBES.filter((probe) => this.matchesFilter(probe, query)).sort(
      (left, right) => this.compare(left, right, query.sort)
    );
    const offset = Math.max(DEFAULT_PAGE_OFFSET, Number(query.offset ?? DEFAULT_PAGE_OFFSET));
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(query.limit ?? DEFAULT_PAGE_LIMIT)));
    const items = filtered
      .slice(offset, offset + limit)
      .map(({ id, name, status, type, region, lastCheckAt }) => ({
        id,
        name,
        status,
        type,
        region,
        lastCheckAt,
      }));

    return {
      items,
      total: filtered.length,
      offset,
      limit,
      hasMore: offset + items.length < filtered.length,
    };
  }

  private matchesFilter(probe: Probe, query: FilterParams): boolean {
    const search = String(query.search ?? '')
      .trim()
      .toLowerCase();
    if (search && !`${probe.name} ${probe.target}`.toLowerCase().includes(search)) {
      return false;
    }

    const filter = this.parseFilter(query.filter);
    return Object.entries(filter).every(([field, value]) => {
      const actual = probe[field as keyof Probe];
      return Array.isArray(value) ? value.includes(String(actual)) : String(actual) === value;
    });
  }

  private parseFilter(filter: FilterParams['filter']): Record<string, string | string[]> {
    if (!filter) {
      return {};
    }
    if (typeof filter !== 'string') {
      return filter;
    }
    try {
      const parsed: unknown = JSON.parse(filter);
      return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, string | string[]>)
        : {};
    } catch {
      return {};
    }
  }

  private compare(left: Probe, right: Probe, sort: FilterParams['sort']): number {
    const descriptor = typeof sort === 'string' ? sort.split(':') : [sort?.field, sort?.direction];
    const field = descriptor[0] as keyof Probe | undefined;
    const direction = (descriptor[1] ?? 'asc') as SortDirection;
    if (!field || !(field in left)) {
      return 0;
    }
    const leftValue = String(left[field]);
    const rightValue = String(right[field]);
    return leftValue.localeCompare(rightValue) * (direction === 'desc' ? -1 : 1);
  }
}
