import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var Razorpay: any;

@Component({
  selector: 'app-policy-payments',
  templateUrl: './policy-payments.component.html',
  styleUrls: ['./policy-payments.component.css']
})
export class PolicyPaymentsComponent implements OnInit {
  installments: any[] = []; // To store the installments
  policyId: string = ''; // Policy ID from the route
  currentPage: number = 1; // Current page number
  pageSize: number = 10; // Number of installments per page
  totalPages: number = 0; // Total pages for pagination
  pageSizes: number[] = [5, 10, 15, 20, 30, 40, 50];
  Razorpay: any;
  taxPercentage: number = 0; // Store tax percentage

  constructor(
    private customer: CustomerService,
    private activatedroute: ActivatedRoute,
    private toastService: ToastService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.policyId = this.activatedroute.snapshot.paramMap.get('id') || '';
    this.getTaxPercentage(); // Fetch tax percentage on page load
    this.getInstallments();
  }

  goBack(): void {
    this.location.back();
    //window.location.href='customer/policies';
  }

  // Fetch installments
  getInstallments(): void {
    this.customer.getInstallmentsById(this.policyId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers;
        this.currentPage = parseInt(paginationHeader.get('X-Current-Page') || '1', 10);
        this.totalPages = parseInt(paginationHeader.get('X-Total-Pages') || '1', 10);

        this.installments = response.body || [];
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching installments:', err);
        this.installments = [];
      }
    });
  }

  // Fetch tax percentage
  getTaxPercentage(): void {
    this.customer.getTaxPercent().subscribe({
      next: (res) => {
        try {
          // Ensure response is an array and has the expected structure
          if (res && Array.isArray(res) && res.length > 0) {
            const taxObject = res[0]; // Access the first object in the array
            if (taxObject && 'taxPercentage' in taxObject) {
              this.taxPercentage = taxObject.taxPercentage;
              console.log('Tax percentage fetched successfully:', this.taxPercentage);
            } else {
              console.error('Missing "taxPercentage" in the response object:', taxObject);
              this.toastService.showToast('error', 'Tax percentage not found in response.');
            }
          } else {
            console.error('Invalid response structure for tax percentage:', res);
            this.toastService.showToast('error', 'Failed to fetch tax percentage. Please try again.');
          }
        } catch (err) {
          console.error('Error processing tax percentage response:', err);
          this.toastService.showToast('error', 'An error occurred while processing the tax percentage.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching tax percentage:', err);
        this.toastService.showToast('error', 'Failed to fetch tax percentage. Please check your connection.');
      }
    });
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getInstallments();
    }
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getInstallments();
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  
  handlePayment(installment: any): void {
    const paymentData = {
      paymentType: 0,
      amountPaid: installment.amountPaid,
      tax: this.taxPercentage,
      totalPayment: installment.amountPaid,
      
      policyId: this.policyId
    };
    console.log(paymentData);
    console.log(installment.amountDue * 100);
    const options = {
      key: "rzp_test_CsdhBIm2T8jG1f",
      amount: Math.round(installment.amountDue*100), // Convert to paise
      name: "Insurance Payment",
      description: `Payment for Installment ${installment.installmentId}`,
      currency: "INR",
      handler: (response: any) => {
        this.onPaymentSuccess(response, installment);
        this.getInstallments();

      },
      
      notes: {
        policyId: this.policyId,
        installmentId: installment.installmentId
      },
      theme: {
        color: "#00308F"
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  onPaymentSuccess(response: any, installment: any): void {
    const currentTimestamp = new Date().toISOString();
    this.getInstallments(); // Refresh installments
      
    // Update installment details
    const updatedInstallment = {
      ...installment,
      paymentReference: response.razorpay_payment_id,
      paymentDate: currentTimestamp,
      amountPaid: installment.amountDue,
      amountDue: 0,
      status: 1 // Paid
    };

    this.customer.updateInstallment(updatedInstallment).subscribe({
      next: () => {
        this.updatePaymentTable(updatedInstallment); // Update payment table
        this.toastService.showToast('success', 'Installment payment successful!');        
        this.getInstallments(); // Refresh installments
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating installment:', err);
        this.toastService.showToast('error', 'Failed to update installment. Please try again.');
      }
    });
  }

  isPayButtonEnabled(dueDate: string): boolean {
  const today = new Date();
  const installmentDueDate = new Date(dueDate);

  // Return true if the due date is today or earlier
  return installmentDueDate <= today;
}

  updatePaymentTable(installment: any): void {
    const currentTimestamp = new Date().toISOString();

    const paymentData = {
      paymentType: 0,
      amountPaid: installment.amountPaid,
      tax: this.taxPercentage,
      totalPayment: installment.amountPaid,
      paymentDate: currentTimestamp,
      policyId: this.policyId
    };

    console.log(paymentData);
    // Add payment entry
    this.customer.makePayment(paymentData).subscribe({
      next: () => {
        console.log("Payment entry added successfully!");
        this.getInstallments();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating payment table:', err);
        this.toastService.showToast('error', 'Failed to update payment table.');
      }
    });
  }
}
