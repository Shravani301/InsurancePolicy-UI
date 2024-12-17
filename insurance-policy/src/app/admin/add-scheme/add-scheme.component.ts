import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-scheme',
  templateUrl: './add-scheme.component.html',
  styleUrls: ['./add-scheme.component.css'],
})
export class AddSchemeComponent implements OnInit {
  addSchemeForm!: FormGroup;
  documentTypes: any[] = []; // List of documents
  selectedDocuments: number[] = []; // To store selected document IDs
  selectedFile: File | null = null; // Selected file for upload
  schemeImageUrl: string = ''; // Uploaded image URL
  selectedDocumentIds: number[] = []; // To store the selected document IDs
  planId!: string;
  planName!: string;
  imageTouched: boolean = false; // Track if image field has been touched
  documentsTouched: boolean = false; // Track if documents dropdown has been touched
  showModal: boolean = false; // To toggle modal visibility
  modalImageURL: string = ''; // Image URL to display in modal
  isUploading: boolean = false; // Track the uploading status


  constructor(
    private admin: AdminService,
    private location: Location,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.planId = idParam;
      this.getPlanName(this.planId);
      console.log(this.planId);
    } else {
      console.error('Missing planId in route parameters');
    }
    // Initialize the form
    this.addSchemeForm = new FormGroup({
      schemeName: new FormControl('', [Validators.required]),
      schemeImage: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      minAmount: new FormControl('', [Validators.required, Validators.min(500)]),
      maxAmount: new FormControl('', [Validators.required, Validators.min(1000)]),
      minInvestTime: new FormControl('', [Validators.required, Validators.min(1)]),
      maxInvestTime: new FormControl('', [Validators.required]),
      minAge: new FormControl('', [Validators.required, Validators.min(18)]),
      maxAge: new FormControl('', [Validators.required,Validators.max(70)]),
      profitRatio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(25)]),
      registrationCommRatio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(20)]),
      installmentCommRatio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(7.5)]),
      claimDeductionPercentage: new FormControl('', [Validators.required, Validators.min(0), Validators.max(15)]),
      penaltyDeductionPercentage: new FormControl('', [Validators.required, Validators.min(0), Validators.max(20)]),
    });
    // Fetch the document types
    this.getDocumentTypes();
  }

  getDocumentTypes(): void {
    this.admin.getDocumentTypes().subscribe({
      next: (res) => {
        this.documentTypes = res.body;
        console.log(this.documentTypes);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch document types:', error);
        this.toastService.showToast(
          'error',
          'Failed to load document types. Please try again.'
        );
      },
    });
  }

  getPlanName(planId: string) {
    this.admin.getPlanById(planId).subscribe(
      {
        next: (response: any) => {
          this.planName = response.planName;
          console.log(this.planName);
        }});
  }
  // Toggle document selection
  toggleDocumentSelection(documentId: number): void {
    const index = this.selectedDocuments.indexOf(documentId);
    if (index === -1) {
      this.selectedDocuments.push(documentId); // Add if not already selected
    } else {
      this.selectedDocuments.splice(index, 1); // Remove if already selected
    }
  }
  // Handle file selection
  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Upload image to server
  uploadImage(): void {
    if (this.selectedFile) {
      this.isUploading = true; // Start the loader
      this.admin.uploadDocument(this.selectedFile).subscribe({
        next: (response: any) => {
          this.schemeImageUrl = response.url; // Assuming `url` contains the uploaded image URL
          this.toastService.showToast('success', 'Image uploaded successfully.');
          this.isUploading=false;
          setTimeout(() => {
            this.schemeImageUrl = response.url; // Simulated uploaded URL
            this.selectedFile = null; // Reset selected file after upload
          }, 1000);
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
          this.isUploading=false;
          this.toastService.showToast('error', 'Image upload failed.');
        },
      });
    } else {
      this.toastService.showToast('error', 'No file selected for upload.');
    }
  }

  openModal(imageUrl: string): void {
    console.log("Opening modal with image URL:", imageUrl);
    this.modalImageURL = imageUrl;
    this.showModal = true;
}


  closeModal(): void {
    this.showModal = false;
    this.modalImageURL = '';
  }
  // Submit form data
  addScheme(): void {
    if (this.addSchemeForm.valid && this.schemeImageUrl) {
      const schemeData = {
        ...this.addSchemeForm.value,
        schemeImage: this.schemeImageUrl,
        requiredDocuments: this.selectedDocuments,
        planId: this.planId, // Include planId
      };
      console.log(schemeData);
      this.admin.addScheme(schemeData).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Scheme registered successfully.');
          this.addSchemeForm.reset();
          this.selectedDocuments = [];
          this.schemeImageUrl = '';
          this.location.back();
        },
        error: (error) => {
          console.error('Failed to register scheme:', error);
          this.toastService.showToast('error', error.error?.errorMessage);
        },
      });
    } else {
      console.log(this.addSchemeForm)
      this.toastService.showToast('error', 'Please complete all required fields.');
    }
  }

  OnCancel(): void {
    this.addSchemeForm.reset();
    this.selectedDocuments = [];
    this.schemeImageUrl = '';
    this.toastService.showToast('info', 'Form reset successfully.');
  }

  goBack(): void {
    this.location.back();
  }
  // Validate all form fields
  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}