import { Component, inject } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { DateTimeDialogComponent } from './date-time-dialog/date-time-dialog.component';

@Component({
  selector: 'app-date-time-cell-editor',
  standalone: true,
  template: '',
  imports: [DateTimeDialogComponent],
})
export class DateTimeCellEditor implements ICellEditorAngularComp {
  private params!: ICellEditorParams;
  private value: string = '';
  private dialog = inject(MatDialog);

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.value = params.value;

    this.dialog
      .open(DateTimeDialogComponent, {
        data: this.value,
        width: '300px',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        this.value = result ?? this.value; // fallback to previous value if canceled
        params.api.stopEditing(); // stop editing regardless
      });
  }

  getValue(): any {
    return this.value;
  }

  isPopup(): boolean {
    return true;
  }

  focusIn(): void {}
  focusOut(): void {}
}
