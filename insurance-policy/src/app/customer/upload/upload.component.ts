import { Component } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {


  title = 'cloud';
  selectedFile: File | null = null;
  uploadResponse: any = null;
 
  constructor(private photoService: FileService) {}
 
  uploadDocument(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoService.uploadToCloudinary(file).subscribe(
        (response: any) => {
          console.log('Uploaded to Cloudinary:', response);
          // Save metadata (e.g., secure_url, public_id) to your backend
          const metadata = {
            publicId: response.public_id,
            secureUrl: response.secure_url,
          };
          console.log(response.secure_url);
          // this.photoService.saveMetadataToBackend(metadata).subscribe(
          //   (res) => console.log('Saved metadata to backend:', res),
          //   (err) => console.error('Backend save error:', err)
          // );
        },
        (error) => console.error('Cloudinary upload error:', error)
      );
    }
  }
 
  openInNewTab(): void {
    if (this.uploadResponse && this.uploadResponse.url) {
      window.open(this.uploadResponse.url, '_blank');  // Open the image URL in a new tab
    } else {
      console.error('No image URL available.');
    }
  }
}
 
 
 