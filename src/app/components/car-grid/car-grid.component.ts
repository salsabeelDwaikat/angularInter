import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridReadyEvent,
  CellClickedEvent,
  CellValueChangedEvent,
} from 'ag-grid-community';
import { CarService, Car } from '../../services/car.service';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';
import { CarMakeEditorComponent } from '../car-make-editor.component';
import { MatSelectModule } from '@angular/material/select'; // ✅ Required for Material dropdown

@Component({
  selector: 'app-car-grid',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    HttpClientModule,
    MatSelectModule, // ✅ Needed to support Material select
    CarMakeEditorComponent, // ✅ Your standalone cell editor
  ],
  templateUrl: './car-grid.component.html',
  styleUrls: ['./car-grid.component.css'],
})
export class CarGridComponent implements OnInit {
  rowData: Car[] = [];
  loading: boolean = false;
  gridApi: any;

  columnDefs: ColDef[] = [
    {
      field: 'id',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 80,
    },
    {
      headerName: 'Make',
      field: 'make',
      editable: true,
      cellEditor: CarMakeEditorComponent,
      cellEditorPopup: true, // ✅ Enables Material dropdown popup
    },
    { field: 'model', editable: true },
    { field: 'year', editable: true },
    { field: 'selling_date', editable: true },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: any) => {
        return `<button class="delete-btn" data-id="${params.data.id}" title="Delete">🗑️</button>`;
      },
      maxWidth: 100,
      menuTabs: [],
      sortable: false,
      filter: false,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    editable: true,
  };

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(event: CellClickedEvent) {
    if (
      event.colDef.field === 'actions' &&
      event.event instanceof Event &&
      event.event.target instanceof HTMLElement &&
      event.event.target.classList.contains('delete-btn')
    ) {
      const carId = event.data.id;
      this.onDeleteCar(carId);
    }
  }

  loadCars() {
    this.loading = true;
    this.carService.getCars().subscribe({
      next: (data: Car[]) => {
        this.rowData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load cars:', err);
        this.loading = false;
      },
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    const updatedCar = event.data;
    if (updatedCar?.id) {
      this.carService.updateCar(updatedCar.id, updatedCar).subscribe({
        next: () => {
          console.log('✅ Car updated:', updatedCar);
        },
        error: (err) => {
          console.error('❌ Failed to update car:', err);
        },
      });
    }
  }

  onAddCar() {
    const newCar: Car = {
      make: 'Porsche',
      model: 'F1',
      year: 2024,
      selling_date: new Date().toISOString().split('T')[0],
    };

    this.carService.createCar(newCar).subscribe({
      next: () => this.loadCars(),
      error: (err) => {
        console.error('❌ Create car failed:', err);
        this.loadCars();
      },
    });
  }

  onDeleteCar(carId: number) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => this.loadCars(),
        error: (err) => console.error('❌ Failed to delete car:', err),
      });
    }
  }

  onDeleteSelected() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.forEach((node: any) => {
      const carId = node.data.id;
      this.carService.deleteCar(carId).subscribe({
        next: () => this.loadCars(),
        error: (err) =>
          console.error(`❌ Failed to delete car ID ${carId}:`, err),
      });
    });
  }
}
