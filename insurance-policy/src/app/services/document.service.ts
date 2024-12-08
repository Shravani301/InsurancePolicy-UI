import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'https://localhost:7052/api/Document'; // Updated backend URL

  constructor(private http: HttpClient) {}

  // Fetch document types
  getDocumentType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/types`);
  }

  // Add a new document
  addDocument(documentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, documentData);
  }
}
