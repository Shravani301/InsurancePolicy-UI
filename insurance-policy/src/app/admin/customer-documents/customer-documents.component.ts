import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { AdminService } from 'src/app/services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-customer-documents',
  templateUrl: './customer-documents.component.html',
  styleUrls: ['./customer-documents.component.css']
})
export class CustomerDocumentsComponent  {
  @ViewChild('fileInput') fileInput!: ElementRef;
  documents: any[] = [];
  filteredDocuments: any[] = [];
  documentTypes: any[] = []; // Document types
  searchQuery: string = '';
  isSearch: boolean = false;
  pageSizes: number[] = [5, 10, 15,20,25,30,40,50	];
  pageSize = this.pageSizes[0];
  currentPage: number = 1;
  totalPages: number = 0;
  hasPrevious=false;
  hasNext=false;
  totalDocumentsCount = 0;
  totalAgentCount = 0;
  customerId: string ='';
  role:any='';
  empId:any='';
  maxVisiblePages: number = 3; // Maximum number of pages to display

  showAddDocumentForm: boolean = false; // Tracks form visibility
  showModal: boolean = false; // Controls modal visibility
  modalImageURL: string | null = null; // URL to display in the modal
  selectedFile: File | null = null;
  reuploadDocumentId: string | null = null; // Stores the document ID for reupload
  reuploadDocumentName: string | null = null; // Tracks document name for reupload

  DocTypeForm!: FormGroup;

  constructor(private customer: CustomerService,private admin:AdminService, private location: Location,
    private activatedRoute: ActivatedRoute, private router: Router, private toastService: ToastService,
    private employee:EmployeeService
  ) {}

  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = idParam;
      console.log(this.customerId);
      this.getDocuments();
    } else {
      console.error('Missing planId in route parameters');
      this.router.navigate(['/error']);
    }
    const storedRole=localStorage.getItem('role');
    this.role=storedRole;
    if (this.role === 'Employee') {
      const storedId = localStorage.getItem('id');
      console.log("Retrieved ID from localStorage:", storedId);
  
      this.empId = storedId;
  
      if (!this.empId) {
          console.error("User ID not found in localStorage for role 'Customer'.");
          return;
      }
    }
    
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
    console.log("customerid:", this.customerId);
    this.admin.getDocuments(this.customerId, this.currentPage, this.pageSize).subscribe(
      (response) => {
        const headers = response.headers;
  
        // Parse headers for pagination metadata
        this.currentPage = parseInt(headers.get('X-Current-Page') || '1', 10);
        this.hasNext = headers.get('X-Has-Next') === 'true';
        this.hasPrevious = headers.get('X-Has-Previous') === 'true';
        this.totalPages = parseInt(headers.get('X-Total-Pages') || '0', 10);
        this.totalDocumentsCount = parseInt(headers.get('X-Total-Count') || '0', 10);
  
        // Assign the response body (documents)
        this.documents = response.body || [];
        this.filteredDocuments = [...this.documents];
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
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
      // If it's a reupload, call reuploadFile()
      if (this.reuploadDocumentId) {
        this.reuploadFile();
      } else {
        // Otherwise, upload a new document
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
                this.getDocuments();
              },
              (error) => {
                console.error('Error saving metadata to backend:', error);
              }
            );
          },
          (error) => {
            console.error('Error uploading to Cloudinary:', error);
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
      this.customer.uploadToCloudinary(this.selectedFile).subscribe(
        (cloudinaryResponse: any) => {
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
              this.getDocuments(); // Refresh the document list
            },
            (error) => {
              console.error('Error updating document:', error);
            }
          );
        },
        (error) => {
          console.error('Error uploading to Cloudinary:', error);
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
  toggleRejectBox(docId: string = ''): void {
    this.showRejectBox = !this.showRejectBox;
    this.selecteddocId = docId;
  }

  rejectDocument(): void {
    this.employee.rejectDocument(this.selecteddocId,this.empId).subscribe({
      next: () => {
        this.getDocuments();
        this.toggleRejectBox(); // Close the box after successful rejection
      },
      error: () => console.error('Error rejecting document'),
    });
  }
  approveDocument(documentId:any): void {
    this.employee.approveDocument(documentId,this.empId).subscribe({
      next: () => {
        this.getDocuments();
      },
      error: () => console.error('Error approve document'),
    });
  }
 // Reject Box State
 showRejectBox: boolean = false;
 selecteddocId: string = '';


  goBack() {
    this.location.back();
  }
}
