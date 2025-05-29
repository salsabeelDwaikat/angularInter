import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching posts:', error);
        return throwError(() => new Error('Failed to fetch posts'));
      })
    );
  }
}
