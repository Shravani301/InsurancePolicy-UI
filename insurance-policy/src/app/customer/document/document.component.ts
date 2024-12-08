import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  documents: any[] = [];
  currentPage: number = 1;
  pageSizes: number[] = [10, 20, 30];
  totalDocumentCount = 0;
  pageSize = this.pageSizes[0];

  customerId: string = '';
  role: string = '';
  DocTypeForm!: FormGroup;
  isAgent = false;
  isCustomer = false;

  documentTypes = [
    { id: '0', name: 'AADHAAR_CARD' },
    { id: '1', name: 'PAN_CARD' },
    { id: '2', name: 'PASSPORT' },
    { id: '3', name: 'DRIVING_LICENSE' },
    { id: '4', name: 'VOTER_ID' },
    { id: '5', name: 'BANK_STATEMENT' },
    { id: '6', name: 'IdentityProof' },
    { id: '7', name: 'AddressProof' },
    { id: '8', name: 'IncomeProof' },
    { id: '9', name: 'AgeProof' },
    { id: '10', name: 'VEHICLE_REGISTRATION_LICENSE' },
    { id: '11', name: 'POLUTION_UNDER_CONTROL_CERTIFICATE' },
    { id: '12', name: 'Other' },
  ];

  constructor(private customer: CustomerService, private location: Location) {}

  ngOnInit() {
    this.customerId = localStorage.getItem('id') || '';
    this.role = localStorage.getItem('role') || '';

    if (!this.customerId || !this.role) {
      alert('Customer ID or role is missing. Please log in again.');
      return;
    }

    this.isCustomer = this.role === 'Customer';
    this.isAgent = this.role === 'Agent';

    this.DocTypeForm = new FormGroup({
      docType: new FormControl('', [Validators.required]),
      documentName: new FormControl('', [Validators.required]),
    });

    this.getDocuments();
  }

  getDocuments() {
    console.log('Fetching documents from the backend...');
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  onFileSelected(event: any) {
    const inputFile = event.target.files[0];
    if (inputFile) {
      this.selectedFile = inputFile;
      console.log('Selected file:', this.selectedFile);
    } else {
      alert('No file selected!');
    }
  }

  onSubmit() {
    const docType = this.DocTypeForm.get('docType')?.value;
    const documentName = this.DocTypeForm.get('documentName')?.value;

    if (this.selectedFile && this.DocTypeForm.valid) {
      console.log('Uploading to Cloudinary...');
      this.customer.uploadToCloudinary(this.selectedFile).subscribe(
        (cloudinaryResponse: any) => {
          console.log('Cloudinary response:', cloudinaryResponse);

          const metadata = {
            documentName: documentName,
            documentPath: cloudinaryResponse.secure_url,
            customerId: this.customerId,
          };

          console.log('Saving metadata to backend...');
          this.customer.saveMetadataToBackend(metadata).subscribe(
            (response) => {
              console.log('Metadata saved successfully:', response);
              alert('Document uploaded and metadata saved successfully!');
              this.DocTypeForm.reset();
              this.fileInput.nativeElement.value = '';
              this.getDocuments();
            },
            (error) => {
              console.error('Error saving metadata to backend:', error);
              alert('Failed to save metadata to backend.');
            }
          );
        },
        (cloudinaryError) => {
          console.error('Error uploading to Cloudinary:', cloudinaryError);
          alert('Failed to upload document to Cloudinary.');
        }
      );
    } else {
      if (!this.selectedFile) alert('No file selected');
      else alert('Please select a document type and name.');
    }
  }

  downloadDocument(doc: any) {
    this.customer.downloadDocument(doc.documentId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.documentName || 'document';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading document:', error);
        alert('Failed to download document.');
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
