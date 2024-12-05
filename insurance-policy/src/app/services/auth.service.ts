import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'https://your-api-url.com'; // Replace with your API endpoint

  constructor(private http: HttpClient, private router: Router) {}

  // login(credentials: { username: string; password: string }) {
  //   return this.http.post(`${this.apiUrl}/login`, credentials);
  // }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Check if token exists
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
