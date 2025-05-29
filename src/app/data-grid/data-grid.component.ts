import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ValueFormatterParams,
  CsvExportParams,
  ICellRendererParams,
  ClientSideRowModelModule,
  CustomEditorModule,
  CellStyleModule,
  ModuleRegistry,
  TextEditorModule,
  EventApiModule,
  NumberEditorModule,
  SelectEditorModule,
  ColumnApiModule,
  RowSelectionModule,
  ClientSideRowModelApiModule
} from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DateTimeCellEditor } from '../components/date-time-cell-editor.component';
import { ConfirmEditDialogComponent } from '../components/confirm-edit-dialog/confirm-edit-dialog.component';

import 'ag-grid-enterprise';

import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  SetFilterModule,
  RichSelectModule,
  CsvExportModule,
  ValidationModule,
} from 'ag-grid-enterprise';

import { firstValueFrom } from 'rxjs';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  MenuModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  RichSelectModule,
  CsvExportModule,
  ClientSideRowModelApiModule,
  ValidationModule,
  TextEditorModule,
  CustomEditorModule,
  EventApiModule,
  SelectEditorModule,
  NumberEditorModule,
  CellStyleModule,
  ColumnApiModule,
  RowSelectionModule
]);

interface Car {
  id?: number; 
  make: string;
  model: string;
  engineType: string;
  horsepower: number;
  price: number;
  dateAdded: string; 
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    DateTimeCellEditor,
    ConfirmEditDialogComponent,
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
})
export class DataGridComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi;

  csvPreviewContent = '';
  storageKey = 'carGridData';
  columnStateKey = 'carGridColumnState';

  rowData: Car[] = [];

  private readonly baseUrl = 'https://fe44-213-6-46-155.ngrok-free.app';

  defaultColDef: ColDef = {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
  };

  columnDefs: (ColDef<Car> | ColGroupDef<Car>)[] = [
    {
      headerName: 'Car Info',
      marryChildren: true,
      children: [
        {
          field: 'make',
          headerName: 'Make',
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['Toyota', 'Ford', 'Porsche', 'Honda', 'BMW'],
          },
        },
        {
          field: 'model',
          headerName: 'Model',
          editable: true,
        },
      ],
    },
    {
      headerName: 'Performance',
      marryChildren: false,
      children: [
        {
          field: 'engineType',
          headerName: 'Engine Type',
          editable: true,
          columnGroupShow: 'open',
        },
        {
          field: 'horsepower',
          headerName: 'Horsepower',
          type: 'numericColumn',
          editable: true,
          columnGroupShow: 'open',
        },
        {
          field: 'price',
          headerName: 'Price',
          editable: true,
          columnGroupShow: 'closed',
        },
      ],
    },
    {
      headerName: 'Metadata',
      children: [
        {
          field: 'dateAdded',
          headerName: 'Date Added',
          editable: true,
          cellEditor: DateTimeCellEditor,
          valueFormatter: (params: ValueFormatterParams) => {
            const val = params.value;
            if (val && typeof val === 'string' && !isNaN(Date.parse(val))) {
              return new Date(val).toLocaleString();
            }
            return '';
          },
        },
      ],
    },
    {
      headerName: 'Actions',
      colId: 'actions',
      editable: false,
      filter: false,
      sortable: false,
      width: 80,
      cellRenderer: (params: ICellRendererParams) => {
        const icon = document.createElement('span');
        icon.classList.add('material-icons');
        icon.style.cursor = 'pointer';
        icon.style.color = 'red';
        icon.textContent = 'delete';

        icon.addEventListener('click', () => {
          const rowIndex = params.node.rowIndex;
          if (typeof rowIndex === 'number') {
            this.deleteCar(rowIndex);
          }
        });

        return icon;
      },
    }
  ];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    await this.loadDataFromBackend();
  }

  private async loadDataFromBackend(): Promise<void> {
    try {
      const cars = await firstValueFrom(
        this.http.get<Car[]>(`${this.baseUrl}/api/cars/`, { responseType: 'json' })
      );
            if (cars && cars.length > 0) {
        this.rowData = cars.map(row => ({
          ...row,
          engineType: row.engineType || 'Unknown',
          horsepower: isNaN(row.horsepower) || row.horsepower == null ? 100 : row.horsepower,
          dateAdded: row.dateAdded || new Date().toISOString(),
        }));
        this.saveData(); // sync localStorage as backup
      } else {
        this.loadSavedData();
      }
    } catch (error) {
      console.error('Error loading from backend, falling back to localStorage:', error);
      this.loadSavedData();
    }
  }

  private loadSavedData(): void {
    const now = new Date().toISOString();
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.rowData = JSON.parse(saved).map((row: Car) => ({
        ...row,
        engineType: row.engineType || 'Unknown',
        horsepower: isNaN(row.horsepower) || row.horsepower == null ? 100 : row.horsepower,
        dateAdded: row.dateAdded || now,
      }));
    } else {
      this.rowData = [
        {
          make: 'Toyota',
          model: 'Corolla',
          engineType: 'V4',
          horsepower: 140,
          price: 25000,
          dateAdded: now,
        },
        {
          make: 'Ford',
          model: 'Focus',
          engineType: 'V6',
          horsepower: 180,
          price: 27000,
          dateAdded: now,
        },
        {
          make: 'Porsche',
          model: '911',
          engineType: 'V8',
          horsepower: 400,
          price: 95000,
          dateAdded: now,
        },
      ];
    }

    this.saveData();
  }

  private saveData(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.rowData));
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;

    const savedColumnState = localStorage.getItem(this.columnStateKey);

    if (savedColumnState) {
      try {
        if (savedColumnState !== 'undefined') {
          const columnState = JSON.parse(savedColumnState);
          this.gridApi.applyColumnState({ state: columnState, applyOrder: true });
        }
      } catch (e) {
        console.error('Error applying saved column state', e);
      }
    }

    this.gridApi.addEventListener('columnVisible', () => this.saveColumnState());
    this.gridApi.addEventListener('columnMoved', () => this.saveColumnState());
    this.gridApi.addEventListener('columnPinned', () => this.saveColumnState());
    this.gridApi.addEventListener('columnGroupOpened', () => this.saveColumnState());
  }

  private saveColumnState(): void {
    if (this.gridApi) {
      const columnState = this.gridApi.getColumnState();
      if (columnState && columnState.length > 0) {
        localStorage.setItem(this.columnStateKey, JSON.stringify(columnState));
      }
    }
  }

  exportToCSV(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: 'car-data.csv',
        suppressQuotes: true,
      });
    }
  }

  showCSVContent(): void {
    if (this.gridApi) {
      const csvParams: CsvExportParams = {
        suppressQuotes: true,
      };
      this.csvPreviewContent = this.gridApi.getDataAsCsv(csvParams) ?? '';
    }
  }

  async onCellValueChanged(event: CellValueChangedEvent<Car>) {
    const { oldValue, newValue, colDef } = event;
    const data = event.data;

    if (oldValue === newValue) return;

    const dialogRef = this.dialog.open(ConfirmEditDialogComponent, {
      data: {
        oldValue: this.formatValue(oldValue),
        newValue: this.formatValue(newValue),
      },
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());

    if (!confirmed) {
      const field = colDef.field;
      if (field && typeof field === 'string') {
        (data as any)[field] = oldValue;
        event.api.refreshCells({ rowNodes: [event.node] });
      }
    } else {
      // Update backend car
      if (data.id) {
        try {
          await firstValueFrom(this.http.put<Car>(`${this.baseUrl}/api/cars/${data.id}/`, data));
          // Update local copy and localStorage
          const idx = this.rowData.findIndex(c => c.id === data.id);
          if (idx !== -1) this.rowData[idx] = data;
          this.saveData();
        } catch (error) {
          console.error('Error updating car in backend:', error);
          // Optionally show error or revert
        }
      } else {
        // No ID means new record, do nothing here (handled on create)
      }
    }
  }

  private formatValue(value: any): string {
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).toLocaleString();
    }
    return value ? String(value) : '';
  }

  async createCar(): Promise<void> {
    const now = new Date().toISOString();
    const newCar: Car = {
      make: 'Toyota',
      model: 'New Model',
      engineType: 'Unknown',
      horsepower: 100,
      price: 0,
      dateAdded: now,
    };

    try {
      const createdCar = await firstValueFrom(this.http.post<Car>(`${this.baseUrl}/api/cars/`, newCar));

      // Add backend assigned id and returned data
      this.rowData = [...this.rowData, createdCar];
      this.saveData();

      // Update grid
      this.gridApi.applyTransaction({ add: [createdCar] });
    } catch (error) {
      console.error('Error creating car in backend:', error);
      // fallback to localStorage only add
      this.rowData = [...this.rowData, newCar];
      this.saveData();
      this.gridApi.applyTransaction({ add: [newCar] });
    }
  }

  async deleteCar(rowIndex: number): Promise<void> {
    const removedCar = this.rowData[rowIndex];
    if (!removedCar) return;

    if (removedCar.id) {
      try {
        await firstValueFrom(this.http.delete(`${this.baseUrl}/api/cars/${removedCar.id}/`));

        this.rowData.splice(rowIndex, 1);
        this.rowData = [...this.rowData];
        this.saveData();

        this.gridApi.applyTransaction({ remove: [removedCar] });
      } catch (error) {
        console.error('Error deleting car in backend:', error);
        // fallback: remove locally anyway
        this.rowData.splice(rowIndex, 1);
        this.rowData = [...this.rowData];
        this.saveData();
        this.gridApi.applyTransaction({ remove: [removedCar] });
      }
    } else {
      // No id means local only, just remove
      this.rowData.splice(rowIndex, 1);
      this.rowData = [...this.rowData];
      this.saveData();
      this.gridApi.applyTransaction({ remove: [removedCar] });
    }
  }

  ngOnDestroy(): void {
    this.saveColumnState();
  }
}
