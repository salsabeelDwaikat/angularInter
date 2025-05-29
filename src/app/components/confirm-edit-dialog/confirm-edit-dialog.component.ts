import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-confirm-edit-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule,AgGridModule, MatButtonModule],
  templateUrl: './confirm-edit-dialog.component.html',
})
export class ConfirmEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { oldValue: any; newValue: any }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
