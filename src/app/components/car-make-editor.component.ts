import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common'; 
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-car-make-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: './car-make-editor.component.html'
})
export class CarMakeEditorComponent implements ICellEditorAngularComp {
  @Input() params: any;
  value: string = '';
  makes: string[] = ['Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'];

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value || '';
  }

  getValue(): any {
    return this.value;
  }

  onBlur() {
    this.params.api.stopEditing();
  }
}
