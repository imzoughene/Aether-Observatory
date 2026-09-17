import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

export type TableKey<T> = Extract<keyof T, string>;

export interface TableCellContext<T> {
  $implicit: T;
  row: T;
  value: unknown;
}

export interface TableColumn<T> {
  key: TableKey<T>;
  label: string;
  sortable?: boolean;
  cellTemplate?: TemplateRef<TableCellContext<T>>;
  value?: (row: T) => unknown;
}

export interface TableSort<T> {
  key: TableKey<T>;
  direction: 'asc' | 'desc';
}

export interface TableRowAction<T> {
  label: string;
  action: string;
  disabled?: (row: T) => boolean;
}

@Component({
  standalone: true,
  selector: 'ui-generic-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            @for (column of columns; track column.key) {
              <th scope="col" [attr.aria-sort]="ariaSort(column)">
                @if (column.sortable) {
                  <button type="button" class="sort-button" (click)="sortBy(column)">
                    {{ column.label }}
                    <span aria-hidden="true">{{ sortIndicator(column) }}</span>
                  </button>
                } @else {
                  {{ column.label }}
                }
              </th>
            }
            @if (rowActions.length) {
              <th scope="col">Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track trackBy($index, row)) {
            <tr [class.selected]="isSelected(row)" (click)="select(row)">
              @for (column of columns; track column.key) {
                <td>
                  @if (column.cellTemplate) {
                    <ng-container
                      [ngTemplateOutlet]="column.cellTemplate"
                      [ngTemplateOutletContext]="cellContext(row, column)"
                    />
                  } @else {
                    {{ cellValue(row, column) }}
                  }
                </td>
              }
              @if (rowActions.length) {
                <td class="actions" (click)="$event.stopPropagation()">
                  @for (rowAction of rowActions; track rowAction.action) {
                    <button
                      type="button"
                      [disabled]="rowAction.disabled?.(row) ?? false"
                      (click)="triggerAction(rowAction, row)"
                    >
                      {{ rowAction.label }}
                    </button>
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td class="empty" [attr.colspan]="columns.length + (rowActions.length ? 1 : 0)">
                {{ emptyMessage }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .table-wrap {
        overflow-x: auto;
      }
      table {
        width: 100%;
        min-width: 680px;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 14px 16px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
        white-space: nowrap;
      }
      th {
        color: #64748b;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background: #f8fafc;
      }
      td {
        color: #1e293b;
        font-size: 14px;
      }
      tbody tr {
        cursor: pointer;
      }
      tbody tr:hover,
      tbody tr.selected {
        background: #f8fafc;
      }
      .sort-button {
        display: inline-flex;
        gap: 6px;
        align-items: center;
        border: 0;
        padding: 0;
        color: inherit;
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: inherit;
        font-weight: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .actions button {
        border: 0;
        padding: 0;
        color: #0f766e;
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: 12px;
      }
      .actions button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .empty {
        padding: 36px 16px;
        color: #64748b;
        text-align: center;
      }
    `,
  ],
})
export class GenericTableComponent<T extends object> {
  @Input({ required: true }) columns: readonly TableColumn<T>[] = [];
  @Input({ required: true }) rows: readonly T[] = [];
  @Input() rowActions: readonly TableRowAction<T>[] = [];
  @Input() emptyMessage = 'No results found.';
  @Input() trackBy: (index: number, row: T) => unknown = (index) => index;
  @Input() sort: TableSort<T> | null = null;
  @Input() selectedRow: T | null = null;

  @Output() readonly sortChange = new EventEmitter<TableSort<T>>();
  @Output() readonly rowSelected = new EventEmitter<T>();
  @Output() readonly action = new EventEmitter<{ action: string; row: T }>();

  cellValue(row: T, column: TableColumn<T>): unknown {
    return column.value?.(row) ?? row[column.key];
  }

  cellContext(row: T, column: TableColumn<T>): TableCellContext<T> {
    return { $implicit: row, row, value: this.cellValue(row, column) };
  }

  sortBy(column: TableColumn<T>): void {
    if (!column.sortable) return;
    const direction =
      this.sort?.key === column.key && this.sort.direction === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key: column.key, direction });
  }

  sortIndicator(column: TableColumn<T>): string {
    return this.sort?.key === column.key ? (this.sort.direction === 'asc' ? '↑' : '↓') : '↕';
  }

  ariaSort(column: TableColumn<T>): 'ascending' | 'descending' | 'none' {
    if (this.sort?.key !== column.key) return 'none';
    return this.sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  isSelected(row: T): boolean {
    return this.selectedRow === row;
  }

  select(row: T): void {
    this.rowSelected.emit(row);
  }

  triggerAction(rowAction: TableRowAction<T>, row: T): void {
    this.action.emit({ action: rowAction.action, row });
  }
}
