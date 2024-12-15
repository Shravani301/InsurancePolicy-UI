import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.css']
})
export class ViewPaymentsComponent implements OnInit {
  paymentsData: any[] = [];
  filteredPaymentsData: any[] = []; // Store filtered data
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 15, 20, 30, 40, 50];
  pageSize: number = this.pageSizes[0];
  searchQuery: string = '';
  // isSearch: boolean = false;
  totalPages: number = 0;  
  isSearch: boolean = false;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(private adminService: AdminService, private location: Location) {}

  ngOnInit(): void {
    this.getPayments();
  }

  goBack(): void {
    this.location.back();
  }
  sortColumn: string = 'paymentDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortClaims(): void {
    this.filteredPaymentsData.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getPayments(): void {
    this.adminService.payments(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // Parse pagination headers
        const headers = {
          currentPage: parseInt(response.headers.get('X-Current-Page') || '1', 10),
          hasNext: response.headers.get('X-Has-Next') === 'true',
          hasPrevious: response.headers.get('X-Has-Previous') === 'true',
          totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
          totalCount: parseInt(response.headers.get('X-Total-Count') || '0', 10),
        };

        // Set pagination properties
        this.currentPage = headers.currentPage;
        this.hasNext = headers.hasNext;
        this.hasPrevious = headers.hasPrevious;
        this.totalPages = headers.totalPages;
        //this.totalCustomerCount = headers.totalCount;

        // Set customer data
        this.paymentsData = response.body || [];
        this.filteredPaymentsData = [...this.paymentsData]; // Initially, filtered data is the same as customerData
      },
      error: () => {
        this.paymentsData = [];
        this.filteredPaymentsData = [];
        this.totalPages = 0;
        this.hasNext = false;
        this.hasPrevious = false;
      },
    });
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getPayments();
  }

  // onSearch(): void {
  //   if (this.searchQuery.trim()) {
  //     this.filteredCustomerData = this.customerData.filter((customer) => {
  //       const searchLower = this.searchQuery.toLowerCase();
  //       return (
  //         customer.customerFirstName.toLowerCase().includes(searchLower) ||
  //         customer.customerLastName.toLowerCase().includes(searchLower)
  //       );
  //     });
  //     this.isSearch = true;
  //   } else {
  //     this.resetSearch();
  //   }
  // }

  // resetSearch(): void {
  //   this.searchQuery = '';
  //   this.isSearch = false;
  //   this.filteredCustomerData = [...this.customerData]; // Reset filtered data to original customer data
  // }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredPaymentsData = this.paymentsData.filter((customer) => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          customer.customerFirstName.toLowerCase().includes(searchLower) ||
          customer.customerLastName.toLowerCase().includes(searchLower)
        );
      });
      this.isSearch = true;
    } else {
      this.resetSearch();
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.isSearch = false;
    this.filteredPaymentsData = [...this.paymentsData]; // Reset filtered data to original customer data
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getPayments();
    }
  }

  // viewDocument(customer: any): void {
  //   console.log('View documents for:', customer);
  // }

  // viewPolicies(customer: any): void {
  //   console.log('View policies for:', customer);
  // }
}
