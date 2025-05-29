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
    if (typeof window === 'undefined') {
      console.warn('Not in browser: localStorage unavailable');
      return of([]); 
    }
  
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error('Token not found in localStorage!');
      return of([]);
    }
  
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'ngrok-skip-browser-warning': 'true' 
    });
  
    console.log("cars serv");
    return this.http.get<Car[]>(`${this.baseUrl}/api/cars/`, { headers });
  }
  

  createCar(car: Car): Observable<Car> {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error('Token not found in localStorage!');
      return of(); 
    }
  
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true' 
    });
  
    return this.http.post<Car>(`${this.baseUrl}/api/cars/`, car, { headers });
  }
  

  updateCar(id: number, car: Car): Observable<Car> {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error('Token not found in localStorage!');
      return of(); 
    }
  
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });
  
    return this.http.put<Car>(`${this.baseUrl}/api/cars/${id}/`, car, { headers });
  }
  

  deleteCar(id: number): Observable<void> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found in localStorage!');
      return of(); 
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.delete<void>(`${this.baseUrl}${id}/`, { headers });
  }
}
