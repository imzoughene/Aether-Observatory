import { firstValueFrom } from 'rxjs';
import { KpiCategory } from '@aether/data-models';
import { MockApiAdapter } from './mock-api.adapter';
import { KpisService } from './kpis.service';

describe('KpisService', () => {
  it('delegates KPI list requests to the configured adapter', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0 });
    const service = new KpisService(adapter);

    const response = await firstValueFrom(service.list());

    expect(response.length).toBeGreaterThan(0);
  });

  it('passes category filters to the adapter', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0 });
    const service = new KpisService(adapter);
    const category: KpiCategory = 'probes';

    const response = await firstValueFrom(service.list({ category }));

    expect(response.every((kpi) => kpi.category === category)).toBe(true);
  });
});
