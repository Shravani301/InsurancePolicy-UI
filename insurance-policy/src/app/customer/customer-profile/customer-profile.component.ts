import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent {
  customerProfile: any = {}; // Customer data
  isEditing: boolean = false; // Edit mode flag
  editableUserName: string = ''; // Editable UserName value

  constructor(
    private customerService: CustomerService,
    private location: Location,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.fetchCustomerProfile();
  }

  fetchCustomerProfile() {
    const customerId = localStorage.getItem('id');
    if (customerId) {
      this.customerService.getCustomerProfile(customerId).subscribe({
        next: (response) => {
          this.customerProfile = response.body;
          this.editableUserName = this.customerProfile.userName; // Initialize editable field
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch customer profile:', err.message);
        },
      });
    } else {
      console.error('Customer ID is not available in local storage');
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Restore original value when canceled
      this.editableUserName = this.customerProfile.userName;
    }
  }

  updateUserName() {
    if (this.editableUserName.trim() === '') {
      alert('UserName cannot be empty!');
      return;
    }

    const updatedData = {
      userName: this.editableUserName,
    };
this.customerProfile.userName = updatedData.userName;
    this.customerService.updateCustomerProfile(this.customerProfile).subscribe({
      next: () => {
        this.customerProfile.userName = this.editableUserName;
        this.isEditing = false;
        this.toastService.showToast("success",'UserName updated successfully!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating UserName:', err);
        this.toastService.showToast("error",'Failed to update UserName.');
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
