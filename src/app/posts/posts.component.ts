import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AgGridModule,
    AgCharts
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'title', 'body'];
  searchKey: string = '';

  agGridColumns: ColDef[] = [
    { field: 'id', sortable: true, filter: true },
    { field: 'title', sortable: true, filter: true },
    { field: 'body', sortable: true, filter: true }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  clearFilter(): void {
    this.searchKey = '';
    this.applyFilter();
  }
}
