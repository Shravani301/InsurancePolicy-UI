import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-policy-payments',
  templateUrl: './policy-payments.component.html',
  styleUrls: ['./policy-payments.component.css']
})
export class PolicyPaymentsComponent implements OnInit {
  installments: any[] = []; // To store the installments
  policyId: string = ''; // Example policy ID; replace or set dynamically
  currentPage: number = 1; // Current page number
  pageSize: number = 10; // Number of installments per page
  totalPages: number = 0; // Total pages for pagination  
  pageSizes: number[] = [5, 10, 15, 20, 30, 40, 50];

  constructor(private customer: CustomerService,
    private activatedroute: ActivatedRoute,
    private toastService: ToastService,
    private location: Location
  ) {}

  ngOnInit(): void {
   
    this.policyId = this.activatedroute.snapshot.paramMap.get('id') || '';
    this.getInstallments();
  }
  goBack(): void {
    this.location.back();
  }

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

}
