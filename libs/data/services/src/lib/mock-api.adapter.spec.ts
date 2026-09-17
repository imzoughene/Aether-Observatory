import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS, PaginatedResponse, ProbeSummary } from '@aether/data-models';
import { ApiClientError } from './api-client';
import { MockApiAdapter } from './mock-api.adapter';

describe('MockApiAdapter', () => {
  it('filters, sorts and paginates probe summaries', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0 });

    const response = await firstValueFrom(
      adapter.get<PaginatedResponse<ProbeSummary>>(API_ENDPOINTS.probes, {
        filter: { status: 'active' },
        sort: 'name:asc',
        limit: 1,
      })
    );

    expect(response).toMatchObject({ total: 2, offset: 0, limit: 1, hasMore: true });
    expect(response.items[0].name).toBe('Primary DNS');
  });

  it('emits an API error when the configured error rate is certain', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0, errorRate: 1 });

    await expect(firstValueFrom(adapter.get(API_ENDPOINTS.probes))).rejects.toMatchObject<
      Partial<ApiClientError>
    >({
      name: 'ApiClientError',
      details: { statusCode: 503, path: API_ENDPOINTS.probes },
    });
  });
});
