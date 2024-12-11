import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl,ValidationErrors } from '@angular/forms';
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

    constructor(
        private admin: AdminService,
        private location: Location,
        private toastService: ToastService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
      const idParam = this.activatedRoute.snapshot.paramMap.get('id');
      if (idParam) {
        this.planId = idParam;
        console.log(this.planId);
        } else {
        console.error('Missing planId in route parameters');
        
      }
        // Initialize the form
        this.addSchemeForm = new FormGroup(
          {
            schemeName: new FormControl('', [Validators.required]),
            schemeImage: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            minAmount: new FormControl('', [Validators.required, Validators.min(0)]),
            maxAmount: new FormControl('', [Validators.required, Validators.min(0)]),
            minInvestTime: new FormControl('', [Validators.required, Validators.min(0)]),
            maxInvestTime: new FormControl('', [Validators.required, Validators.min(0)]),
            minAge: new FormControl('', [Validators.required, Validators.min(0)]),
            maxAge: new FormControl('', [Validators.required, Validators.min(0)]),
            profitRatio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
            registrationCommRatio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
            installmentCommRatio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
          },
          { validators: this.validateMinMaxFields } // Attach the custom validator
        );
        
        // Fetch the document types
        this.getDocumentTypes();        
    }
    private validateMinMaxFields(group: AbstractControl): ValidationErrors | null {
      const minAmount = group.get('minAmount')?.value;
      const maxAmount = group.get('maxAmount')?.value;
      const minInvestTime = group.get('minInvestTime')?.value;
      const maxInvestTime = group.get('maxInvestTime')?.value;
      const minAge = group.get('minAge')?.value;
      const maxAge = group.get('maxAge')?.value;
    
      const errors: ValidationErrors = {};
    
      if (minAmount !== null && maxAmount !== null && minAmount > maxAmount) {
        errors['minMaxAmount'] = 'Minimum amount must be less than or equal to Maximum amount.';
      }
    
      if (minInvestTime !== null && maxInvestTime !== null && minInvestTime > maxInvestTime) {
        errors['minMaxInvestTime'] = 'Minimum investment time must be less than or equal to Maximum investment time.';
      }
    
      if (minAge !== null && maxAge !== null && minAge > maxAge) {
        errors['minMaxAge'] = 'Minimum age must be less than or equal to Maximum age.';
      }
    
      return Object.keys(errors).length ? errors : null;
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
      this.admin.uploadDocument(this.selectedFile).subscribe({
        next: (response: any) => {
          this.schemeImageUrl = response.url; // Assuming `url` contains the uploaded image URL
          this.toastService.showToast('success', 'Image uploaded successfully.');
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
          this.toastService.showToast('error', 'Image upload failed.');
        },
      });
    } else {
      this.toastService.showToast('error', 'No file selected for upload.');
    }
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
          this.toastService.showToast('error', 'Failed to register scheme.');
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

    addFieldBlurHandler(fieldName: string): void {
      const control = this.addSchemeForm.get(fieldName);
      const formErrors = this.addSchemeForm.errors;
    
      if (control?.invalid && control?.touched) {
        const errorType = Object.keys(control.errors || {})[0];
        let errorMessage = '';
    
        switch (errorType) {
          case 'required':
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
            break;
          case 'min':
            errorMessage = `${this.getFieldLabel(fieldName)} must be greater than or equal to ${control.errors?.['min']?.min}.`;
            break;
          case 'max':
            errorMessage = `${this.getFieldLabel(fieldName)} must be less than or equal to ${control.errors?.['max']?.max}.`;
            break;
          default:
            errorMessage = `${this.getFieldLabel(fieldName)} is invalid.`;
        }
    
        this.toastService.showToast('error', errorMessage);
      }
    
      // Handle custom validation errors
      if (formErrors?.['minMaxInvestTime']) {
        this.toastService.showToast('error', 'Minimum term must be less than or equal to Maximum term.');
      }
    
      if (formErrors?.['minMaxAge']) {
        this.toastService.showToast('error', 'Minimum age must be less than or equal to Maximum age.');
      }
    
      if (formErrors?.['minMaxAmount']) {
        this.toastService.showToast('error', 'Minimum amount must be less than or equal to Maximum amount.');
      }
    }
    
    
    
    // Helper method to get user-friendly field labels
    getFieldLabel(fieldName: string): string {
      const labels: { [key: string]: string } = {
        schemeName: 'Scheme Name',
        schemeImage: 'Scheme Image',
        description: 'Description',
        minAmount: 'Minimum Investment',
        maxAmount: 'Maximum Investment',
        minInvestTime: 'Minimum Term',
        maxInvestTime: 'Maximum Term',
        minAge: 'Minimum Age',
        maxAge: 'Maximum Age',
        profitRatio: 'Profit Ratio',
        registrationCommRatio: 'Registration Commission',
        installmentCommRatio: 'Installment Commission',
      };
      return labels[fieldName] || fieldName;
    }
    
}
