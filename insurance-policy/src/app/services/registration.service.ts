import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service available throughout the app
})
export class RegistrationService {
  private apiUrl = 'https://localhost:7052/api/Customer'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Method to send registration data to the backend
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
}
