import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent {
  customerProfile: any; // To store customer profile data

  constructor(private customerService: CustomerService, private location: Location) {}

  ngOnInit() {
    const customerId = localStorage.getItem('id'); // Retrieve the customer ID from local storage
  
    if (customerId) {
      this.customerService.getCustomerProfile(customerId).subscribe({
        next: (response) => {
          this.customerProfile = response.body; // Access the response body
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch customer profile:', err.message);
        }
      });
    } else {
      console.error('Customer ID is not available in local storage');
    }
  }
  

  goBack() {
    this.location.back(); // Navigate back to the previous page
  }
}
