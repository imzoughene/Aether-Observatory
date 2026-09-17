import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GenericTableComponent, TableColumn, TableRowAction } from '@aether/ui-shared';

type RowData = { id: number; name: string; status: string };

@Component({
  standalone: true,
  imports: [GenericTableComponent],
  template: `
    <ui-generic-table
      [columns]="columns"
      [rows]="rows"
      [rowActions]="rowActions"
      (rowSelected)="selected = $event"
    />
  `,
})
class TestHostComponent {
  readonly columns: readonly TableColumn<RowData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ];
  readonly rows: readonly RowData[] = [
    { id: 1, name: 'alpha', status: 'healthy' },
    { id: 2, name: 'beta', status: 'warning' },
  ];
  readonly rowActions: readonly TableRowAction<RowData>[] = [{ label: 'Open', action: 'open' }];
  selected: RowData | null = null;
}

describe('Table accessibility', () => {
  it('keeps rows keyboard accessible and activates with Enter', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tbody tr');

    expect(row.getAttribute('tabindex')).toBe('0');
    expect(row.getAttribute('role')).toBe('button');

    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selected).toEqual({ id: 1, name: 'alpha', status: 'healthy' });
  });
});
