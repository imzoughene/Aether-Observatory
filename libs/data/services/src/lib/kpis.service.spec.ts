import { firstValueFrom } from 'rxjs';
import { KpiCategory } from '@aether/data-models';
import { MockApiAdapter } from './mock-api.adapter';
import { KpisService } from './kpis.service';
import { ProbeConfiguration, ProbesService } from './probes.service';

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

describe('ProbesService', () => {
  const configuration: ProbeConfiguration = {
    name: 'Updated probe',
    type: 'HTTP',
    target: 'https://updated.aether.io/health',
    region: 'eu-west-1',
    intervalSec: 60,
    timeoutSec: 10,
  };

  it('checks names case-insensitively while excluding the current probe', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0 });
    const service = new ProbesService(adapter);

    await expect(firstValueFrom(service.nameExists('public api'))).resolves.toBe(true);
    await expect(firstValueFrom(service.nameExists('Public API', 'probe-001'))).resolves.toBe(
      false
    );
  });

  it('simulates a successful update and a save error', async () => {
    const adapter = new MockApiAdapter();
    adapter.configure({ latencyMs: 0 });
    const service = new ProbesService(adapter);

    await expect(firstValueFrom(service.update('probe-001', configuration))).resolves.toMatchObject(
      configuration
    );
    await expect(
      firstValueFrom(service.update('probe-001', { ...configuration, target: 'simulate-error' }))
    ).rejects.toThrow('mock save service rejected');
  });
});
