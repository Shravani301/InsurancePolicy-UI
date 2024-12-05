import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'https://localhost:7052/api/Login'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Ensure proper content type
    });

    return this.http.post<any>(this.apiUrl, credentials, {
      headers,
      observe: 'response', // Include headers in the response
    });
  }
}
