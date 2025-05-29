import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-time-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './date-time-dialog.component.html',
  styleUrls: ['./date-time-dialog.component.css']
})
export class DateTimeDialogComponent {
  date: string = '';
  time: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<DateTimeDialogComponent>
  ) {
    if (data) {
      const [d, t] = data.split('T');
      this.date = d;
      this.time = t || '00:00';
    }
  }

  save(): void {
    const result = `${this.date}T${this.time}`;
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
