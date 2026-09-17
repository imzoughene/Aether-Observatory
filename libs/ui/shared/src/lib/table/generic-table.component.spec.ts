import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericTableComponent, TableColumn, TableRowAction } from './generic-table.component';

type Row = { id: string; name: string; status: string; value: number };

describe('GenericTableComponent', () => {
  let fixture: ComponentFixture<GenericTableComponent<Row>>;
  let component: GenericTableComponent<Row>;

  const columns: TableColumn<Row>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' },
  ];

  const rows: Row[] = [
    { id: '1', name: 'API Gateway', status: 'active', value: 98 },
    { id: '2', name: 'Database', status: 'warning', value: 76 },
  ];

  const actions: TableRowAction<Row>[] = [
    { label: 'View', action: 'view' },
    { label: 'Disable', action: 'disable', disabled: (row) => row.status === 'warning' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericTableComponent<Row>);
    component = fixture.componentInstance;
    component.columns = columns;
    component.rows = rows;
    component.rowActions = actions;
    fixture.detectChanges();
  });

  it('renders rows and action buttons, and uses custom value accessors', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(host.textContent).toContain('API Gateway');
    expect(host.textContent).toContain('View');
    expect(host.querySelectorAll('button[aria-label^="Disable"]').length).toBeGreaterThan(0);

    expect(component.cellValue(rows[0], columns[0])).toBe('API Gateway');
    expect(component.cellContext(rows[0], columns[0])).toEqual({
      $implicit: rows[0],
      row: rows[0],
      value: 'API Gateway',
    });
  });

  it('emits the correct sort direction and aria state', () => {
    const sortSpy = jest.fn();
    component.sortChange.subscribe(sortSpy);
    component.sort = { key: 'name', direction: 'asc' };

    component.sortBy(columns[0]);
    expect(sortSpy).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
    expect(component.sortIndicator(columns[0])).toBe('↑');
    expect(component.ariaSort(columns[0])).toBe('ascending');

    component.sort = { key: 'status', direction: 'desc' };
    expect(component.sortIndicator(columns[0])).toBe('↕');
    expect(component.ariaSort(columns[0])).toBe('none');
  });

  it('selects rows, emits actions, and handles keyboard events', () => {
    const rowSpy = jest.fn();
    const actionSpy = jest.fn();
    component.rowSelected.subscribe(rowSpy);
    component.action.subscribe(actionSpy);

    component.select(rows[0]);
    expect(rowSpy).toHaveBeenCalledWith(rows[0]);

    component.triggerAction(actions[0], rows[0]);
    expect(actionSpy).toHaveBeenCalledWith({ action: 'view', row: rows[0] });

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    component.handleRowKeydown(event, rows[0]);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(rowSpy).toHaveBeenLastCalledWith(rows[0]);

    expect(component.rowLabel(rows[0])).toBe('Select API Gateway');
    expect(component.isSelected(rows[0])).toBe(false);
    component.selectedRow = rows[0];
    expect(component.isSelected(rows[0])).toBe(true);
  });
});
