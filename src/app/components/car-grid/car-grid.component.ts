import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import { CarService, Car } from '../../services/car.service';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-car-grid',
  standalone: true,
  imports: [CommonModule, AgGridModule, HttpClientModule],
  templateUrl: './car-grid.component.html',
  styleUrls: ['./car-grid.component.css']
})
export class CarGridComponent implements OnInit {
  rowData: Car[] = [];
  loading: boolean = false;

  columnDefs: ColDef[] = [
    { field: 'id', checkboxSelection: true, headerCheckboxSelection: true, maxWidth: 80 },
    { field: 'make', editable: true },
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
      filter: false
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    editable: true
  };

  private gridApi: any;

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
      event.event &&
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
        console.log("car loaded")
        console.log(data)
        this.rowData = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('❌ Failed to load cars:', err);
        if (err.status === 500) {
          console.error('🚨 Internal Server Error: Check your backend logs.');
        } else if (err.status === 401 || err.status === 403) {
          console.error('🔒 Unauthorized: Check your token or login.');
        } else {
          console.error('❓ Unknown error occurred:', err.message);
        }
      }
    });
  }

  onCellValueChanged(event: any) {
    const updatedCar: Car = event.data;
    if (updatedCar.id) {
      this.carService.updateCar(updatedCar.id, updatedCar).subscribe({
        next: () => {
          console.log('✅ Car updated:', updatedCar);
        },
        error: (err) => {
          console.error('❌ Failed to update car:', err);
        }
      });
    }
  }

  onAddCar() {
    const newCar: Car = {
      make: 'Porsche',
      model: 'F1',
      year: 2024,
      selling_date: new Date().toISOString().split('T')[0]
    };

    this.rowData = [...this.rowData, newCar];
    this.gridApi?.setRowData(this.rowData);

    this.carService.createCar(newCar).subscribe({
      next: (createdCar) => {
        console.log('✅ New car created:', createdCar);
        this.rowData = this.rowData.map(car =>
          car === newCar ? createdCar : car
        );
        this.gridApi?.setRowData(this.rowData);
      },
      error: (err) => {
        console.error('❌ Create car failed:', err);
        this.rowData = this.rowData.filter(car => car !== newCar);
        this.gridApi?.setRowData(this.rowData);
      }
    });
  }

  onDeleteCar(carId: number) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => {
          console.log('🗑️ Car deleted:', carId);
          this.loadCars();
        },
        error: (err) => {
          console.error('❌ Failed to delete car:', err);
        }
      });
    }
  }

  onDeleteSelected() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.forEach((node: any) => {
      const carId = node.data.id;
      this.carService.deleteCar(carId).subscribe({
        next: () => {
          console.log('🗑️ Selected car deleted:', carId);
          this.loadCars();
        },
        error: (err) => {
          console.error(`❌ Failed to delete car with ID ${carId}:`, err);
        }
      });
    });
  }
}
