import { TestBed } from '@angular/core/testing';
import { UiStateService } from '@aether/core';

describe('UiStateService', () => {
  let service: UiStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UiStateService] });
    service = TestBed.inject(UiStateService);
  });

  it('updates sidebar and selection state through actions', () => {
    service.toggleSidebar();
    service.selectProbe('probe-1');

    expect(service.sidebarOpen()).toBe(false);
    expect(service.selectedProbeId()).toBe('probe-1');
  });

  it('resets filter pagination and exposes derived active state', () => {
    service.setFilter('status', 'warning');
    service.setPage(3);

    expect(service.currentFilters()).toMatchObject({ status: 'warning', page: 3 });
    expect(service.hasActiveFilters()).toBe(true);

    service.clearFilters();

    expect(service.hasActiveFilters()).toBe(false);
    expect(service.currentFilters().page).toBe(0);
  });
});
