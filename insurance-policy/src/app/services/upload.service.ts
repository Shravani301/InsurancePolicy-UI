import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  constructor(private http: HttpClient) {}

  // Upload image to Cloudinary
  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'customer_documents'); // Replace with your preset
    // No need for Authorization header!
  
    fetch('https://api.cloudinary.com/v1_1/dad8bwxk8/auto/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload successful:', data);
  
        // Send the secure URL to the backend
        this.http.post('/api/images', { imageURL: data.secure_url }).subscribe({
          next: (res) => console.log('Saved to database:', res),
          error: (err) => console.error('Database error:', err),
        });
      })
      
      .catch((error) => console.error('Cloudinary upload error:', error));
     
  }
}
