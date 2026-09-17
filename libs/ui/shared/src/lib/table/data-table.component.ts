import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GenericTableComponent, TableColumn } from './generic-table.component';

export interface DataTableColumn {
  key: string;
  label: string;
}

export type DataTableRow = Record<string, string>;

@Component({
  standalone: true,
  selector: 'ui-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericTableComponent],
  template: `<ui-generic-table
    [columns]="tableColumns()"
    [rows]="rows()"
    emptyMessage="No probes match these filters."
  />`,
})
export class DataTableComponent {
  readonly columns = input.required<readonly DataTableColumn[]>();
  readonly rows = input.required<readonly DataTableRow[]>();

  readonly tableColumns = () =>
    this.columns().map((column): TableColumn<DataTableRow> => ({
      key: column.key,
      label: column.label,
    }));
}
