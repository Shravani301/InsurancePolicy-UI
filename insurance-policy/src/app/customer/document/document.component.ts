import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  documents: any[] = [];
  filteredDocuments: any[] = [];
  documentTypes: any[] = []; // Document types
  searchQuery: string = '';
  isSearch: boolean = false;
  pageSizes: number[] = [5, 10, 15];
  pageSize = this.pageSizes[0];
  currentPage: number = 1;
  totalPages: number = 0;
  totalAgentCount = 0;
  isUploading: boolean = false;
  maxVisiblePages: number = 3; // Maximum number of pages to display
  
  sortColumn: string = 'customerFirstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  showAddDocumentForm: boolean = false; // Tracks form visibility
  showModal: boolean = false; // Controls modal visibility
  modalImageURL: string | null = null; // URL to display in the modal
  selectedFile: File | null = null;
  reuploadDocumentId: string | null = null; // Stores the document ID for reupload
  reuploadDocumentName: string | null = null; // Tracks document name for reupload

  DocTypeForm!: FormGroup;

  constructor(private customer: CustomerService, private location: Location,private toastService:ToastService) {}

  ngOnInit() {
    this.DocTypeForm = new FormGroup({
      documentName: new FormControl('', [Validators.required]),
    });

    // Load document types and documents on page load
    this.getDocumentTypes();
    this.getDocuments();
  }
 

  changePage(page: number): void {    
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getDocuments();
    }
  } 
    getVisiblePages(): number[] {
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = start + this.maxVisiblePages - 1;
  
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - this.maxVisiblePages + 1, 1);
    }
  
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getDocuments();
  }

  get pageCount(): number {
    return Math.ceil(this.totalAgentCount / this.pageSize);
  }

  toggleAddDocumentForm() {
    this.showAddDocumentForm = !this.showAddDocumentForm;

    // Reset form and reupload state when toggling the form
    if (this.showAddDocumentForm) {
      this.DocTypeForm.reset();
      this.reuploadDocumentId = null;
      this.reuploadDocumentName = null;
      this.selectedFile = null;
    }
  }

  getDocumentTypes() {
    this.customer.getDocumentTypes().subscribe(
      (types) => {
        this.documentTypes = types; // Store document types in the array
      },
      (error) => {
        console.error('Error fetching document types:', error);
      }
    );
  }

  getDocuments() {
    const customerId = localStorage.getItem('id') || '';
    const role = localStorage.getItem('role') || 'Customer';
 
    this.customer.getDocuments(customerId, role).subscribe(
      (documents) => {
        // Filter and process the documents
        this.documents = documents;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }
 
  updatePagination() {
    this.totalPages = Math.ceil(this.documents.length / this.pageSize);
    this.filteredDocuments = this.documents.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  

  onFileSelected(event: any) {
    const inputFile = event.target.files[0];
    if (inputFile) {
      this.selectedFile = inputFile;
    }
  }

  onSubmit() {
    const documentName = this.DocTypeForm.get('documentName')?.value;
  
    if (this.selectedFile && this.DocTypeForm.valid) {
      this.isUploading = true; // Start loader
      if (this.reuploadDocumentId) {
        this.reuploadFile();
      } else {
        this.customer.uploadDocument(this.selectedFile).subscribe(
          (cloudinaryResponse: any) => {
            const metadata = {
              documentName: documentName,
              documentPath: cloudinaryResponse.url,
              customerId: localStorage.getItem('id') || '',
            };
  
            this.customer.saveMetadataToBackend(metadata).subscribe(
              () => {
                this.DocTypeForm.reset();
                this.fileInput.nativeElement.value = '';
                this.showAddDocumentForm = false;
                this.isUploading = false; // Stop loader
                this.getDocuments(); // Reload documents
              },
              (error) => {
                console.error('Error saving metadata to backend:', error);
                this.isUploading = false; // Stop loader on error
              }
            );
          },
          (error) => {
            console.error('Error uploading to Cloudinary:', error);
            this.isUploading = false; // Stop loader on error
          }
        );
      }
    }
  }
  

  reuploadDocument(doc: any) {
    this.reuploadDocumentId = doc.id; // Store the document ID for reupload
    this.reuploadDocumentName = doc.documentName; // Track the document name
    this.showAddDocumentForm = true; // Open the add document form for reupload
    this.DocTypeForm.patchValue({ documentName: doc.documentName }); // Pre-fill the document name
  }

  reuploadFile() {
    if (this.selectedFile && this.reuploadDocumentId) {
      this.isUploading = true; // Start loader
      this.customer.uploadToCloudinary(this.selectedFile).subscribe(
        (cloudinaryResponse: any) => {
          this.isUploading = false;
          const updatedDocument = {
            documentName: this.reuploadDocumentName,
            documentPath: cloudinaryResponse.secure_url,
          };
  
          this.customer.updateDocument(updatedDocument).subscribe(
            () => {
              this.selectedFile = null;
              this.reuploadDocumentId = null;
              this.reuploadDocumentName = null;
              this.showAddDocumentForm = false;
              this.isUploading = false; // Stop loader
              this.getDocuments(); // Reload documents
            },
            (error) => {
              console.error('Error updating document:', error);
              this.isUploading = false; // Stop loader on error
            }
          );
        },
        (error) => {
          console.error('Error uploading to Cloudinary:', error);
          this.isUploading = false; // Stop loader on error
        }
      );
    }
  }
  

  viewDocument(doc: any) {
    this.modalImageURL = doc.documentPath; // Set the image URL
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalImageURL = null;
  }

  onSearch(): void {
    const searchLower = this.searchQuery.trim().toLowerCase();
  
    if (searchLower) {
      this.filteredDocuments = this.documents.filter((document) => {
        // Check if the document name includes the search query (case-insensitive)
        return document.documentName.toLowerCase().includes(searchLower);
      });
      this.isSearch = true;
    } else {
      // If the search query is empty, reset the filtered list to show all documents
      this.filteredDocuments = [...this.documents];
      this.isSearch = false;
    }
  }
  

  goBack() {
    this.location.back();
  }
}
