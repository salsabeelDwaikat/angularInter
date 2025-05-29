import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Car {
  id?: number;
  make: string;
  model: string;
  year: number;
  selling_date: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private baseUrl = environment.apiBaseUrl; 

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found in localStorage!');
      return of([]); 
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
console.log("cars serv")
    return this.http.get<Car[]>(this.baseUrl, { headers });
  }

  createCar(car: Car): Observable<Car> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found in localStorage!');
      return of(); 
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Car>(this.baseUrl, car, { headers });
  }

  updateCar(id: number, car: Car): Observable<Car> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found in localStorage!');
      return of(); 
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<Car>(`${this.baseUrl}${id}/`, car, { headers });
  }

  deleteCar(id: number): Observable<void> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found in localStorage!');
      return of(); 
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.baseUrl}${id}/`, { headers });
  }
}
