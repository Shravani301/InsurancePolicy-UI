import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {} // Inject HttpClient

  uploadToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'customer_documents'); // Use the preset name you set in Cloudinary

    return this.http.post('https://api.cloudinary.com/v1_1/dad8bwxk8/auto/upload', formData);
  }
}
