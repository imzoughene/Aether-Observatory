import { TestBed } from '@angular/core/testing';
import { KpiCardComponent, KpiCardData } from './kpi-card.component';

describe('KpiCardComponent', () => {
  const baseKpi: KpiCardData = {
    label: 'Global Uptime',
    value: 99.7,
    formattedValue: '99.7%',
    unit: '%',
    category: 'uptime',
    severity: 'success',
    trend: 'up',
    trendPercent: 0.2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();
  });

  it('renders the KPI label, formatted value and direction markers', () => {
    const fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('kpi', baseKpi);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.kpi-label')?.textContent).toContain('Global Uptime');
    expect(host.querySelector('.kpi-value')?.textContent).toContain('99.7%');
    expect(host.querySelector('.kpi-trend')?.textContent).toContain('↑');
    expect(host.querySelector('.kpi-category')?.textContent).toBe('uptime');
    expect(host.querySelector('.sparkline polyline')).not.toBeNull();
  });

  it('falls back to stable/no-change labels and numeric averages when no trend or samples exist', () => {
    const fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('kpi', {
      ...baseKpi,
      label: 'Graph Load',
      value: 42,
      formattedValue: undefined,
      trend: undefined,
      severity: undefined,
    });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.kpi-value')?.textContent).toContain('42');
    expect(host.querySelector('.kpi-trend')?.textContent).toContain('No change');
    expect(host.querySelector('.kpi-average')?.textContent).toContain('Avg 42');
    expect(host.querySelector('.kpi-value')?.classList.contains('neutral')).toBe(true);
  });
});
