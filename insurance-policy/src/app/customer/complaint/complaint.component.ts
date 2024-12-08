import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent {
  addComplaintForm!: FormGroup; // Use ! to indicate that this will be initialized later
  customerProfile: any;

  constructor(
    private customer: CustomerService,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.addComplaintForm = new FormGroup({
      title: new FormControl('', [Validators.required, this.onlyCharactersValidator]),
      message: new FormControl('', [Validators.required])
    });
    this.getCustomerProfile();
  }

  goBack(): void {
    this.location.back();
  }

  getCustomerProfile(): void {
    const customerId = localStorage.getItem('id'); // Get customer ID from localStorage
    if (customerId) {
      this.customer.getCustomerProfile(customerId).subscribe({
        next: (res: any) => {
          this.customerProfile = res;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch customer profile:', err);
          this.toastService.showToast('error', 'Failed to fetch customer profile.');
        }
      });
    }
  }

  addComplaint(): void {
    if (this.addComplaintForm.valid) {
      // Ensure customerId is fetched from localStorage
      const customerId = localStorage.getItem('id');

      if (!customerId) {
        this.toastService.showToast('error', 'Customer ID is missing. Please log in again.');
        return;
      }

      // Prepare the complaint object with all necessary fields
      const complaint = {
        title: this.addComplaintForm.get('title')!.value,
        message: this.addComplaintForm.get('message')!.value,
        customerId: customerId // Include the customerId in the payload
      };

      console.log('Payload:', complaint); // Debugging log to verify the payload

      this.customer.addComplaint(complaint).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Complaint added successfully!');
          this.addComplaintForm.reset();
          this.location.back(); // Go back to previous page
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error:', err);
          this.toastService.showToast('error', 'Failed to add complaint.');
        }
      });
    } else {
      this.validateAllFormFields(this.addComplaintForm);
      this.toastService.showToast('error', 'Please fill out all required fields.');
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  onlyCharactersValidator(control: FormControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z ]+$/.test(control.value);
    return valid ? null : { onlyCharacters: { message: 'Only alphabetic characters are allowed.' } };
  }
}
