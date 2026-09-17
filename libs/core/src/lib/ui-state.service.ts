import { computed, Injectable, signal } from '@angular/core';
import { SortParam } from '@aether/data-models';

export interface UiFilters {
  status: string;
  type: string;
  health: string;
  sort: SortParam;
  page: number;
}

const initialFilters: UiFilters = {
  status: '',
  type: '',
  health: '',
  sort: { field: 'name', direction: 'asc' },
  page: 0,
};

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  readonly sidebarOpen = signal(true);
  readonly currentFilters = signal<UiFilters>({ ...initialFilters });
  readonly selectedProbeId = signal<string | null>(null);
  readonly hasActiveFilters = computed(() => {
    const filters = this.currentFilters();
    return Boolean(filters.status || filters.type || filters.health);
  });

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpen.set(open);
  }

  setFilter(filter: 'status' | 'type' | 'health', value: string): void {
    this.currentFilters.update((current) => ({ ...current, [filter]: value, page: 0 }));
  }

  setSort(sort: SortParam): void {
    this.currentFilters.update((current) => ({ ...current, sort, page: 0 }));
  }

  clearFilters(): void {
    this.currentFilters.update((current) => ({
      ...current,
      status: '',
      type: '',
      health: '',
      page: 0,
    }));
  }

  setPage(page: number): void {
    this.currentFilters.update((current) => ({ ...current, page: Math.max(0, page) }));
  }

  selectProbe(probeId: string | null): void {
    this.selectedProbeId.set(probeId);
  }
}
