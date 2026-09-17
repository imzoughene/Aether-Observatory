import { Subject } from 'rxjs';
import { PaginatedResponse, ProbeSummary } from '@aether/data-models';
import { ApiClient } from './api-client';
import { MockApiAdapter } from './mock-api.adapter';
import { ProbesService } from './probes.service';

describe('ProbesService', () => {
  it('delegates probe list requests to the configured adapter', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0 });
    const service = new ProbesService(adapter);

    const response = await service.list({ limit: 2 }).toPromise();

    expect(response?.items).toHaveLength(2);
    expect(response?.limit).toBe(2);
  });

  it('cancels the previous list request when query changes', () => {
    jest.useFakeTimers();
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 20 });
    const service = new ProbesService(adapter);
    const queries = new Subject<{ offset: number }>();
    const responses: Array<PaginatedResponse<ProbeSummary>> = [];

    service.listFrom(queries).subscribe((response) => responses.push(response));
    queries.next({ offset: 0 });
    jest.advanceTimersByTime(5);
    queries.next({ offset: 2 });
    jest.advanceTimersByTime(15);

    expect(responses).toHaveLength(0);
    jest.advanceTimersByTime(5);

    expect(responses).toHaveLength(1);
    expect(responses[0].offset).toBe(2);
    jest.useRealTimers();
  });

  it('can be constructed with any ApiClient implementation', () => {
    const client = new (class extends ApiClient {
      get<T>(): import('rxjs').Observable<T> {
        return new Subject<T>();
      }
    })();

    expect(new ProbesService(client)).toBeInstanceOf(ProbesService);
  });
});
