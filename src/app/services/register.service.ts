import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'https://fe44-213-6-46-155.ngrok-free.app';
const API_URL = `${BASE_URL}/polls/api/register/`;

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  registerUser(data: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(API_URL, data);
  }
}
