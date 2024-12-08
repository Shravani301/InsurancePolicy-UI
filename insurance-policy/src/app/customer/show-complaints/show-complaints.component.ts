  import { Component, OnInit } from '@angular/core';
  import { AdminService } from 'src/app/services/admin.service';
  import { Location } from '@angular/common';
  import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
  
  @Component({
    selector: 'app-show-complaints',
    templateUrl: './show-complaints.component.html',
    styleUrls: ['./show-complaints.component.css']
  })
  export class ShowComplaintsComponent implements OnInit {
    complaints: any[] = [];
    filteredComplaints: any[] = [];
    totalComplaintCount = 0;
    currentPage = 1;
    pageSize = 5;
    pageSizes = [5, 10, 15, 20];
    searchQuery: string = '';
    isSearch = false;
  
    constructor(
      private customer:CustomerService,
      private location: Location,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.getComplaints();
    }
  
    goBack(): void {
      this.location.back();
    }
  
    getComplaints(): void {
      this.customer.getComplaints(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          const paginationHeader = response.headers.get('X-Pagination');
          if (paginationHeader) {
            const paginationData = JSON.parse(paginationHeader);
            this.totalComplaintCount = paginationData.TotalCount;
          }
          this.complaints = response.body || [];
          this.filteredComplaints = [...this.complaints];
        },
        error: () => {
          this.complaints = [];
          this.filteredComplaints = [];
        },
      });
    }
    fileComplaint(): void {
      this.router.navigateByUrl('/customer/add-complaint'); // Adjust the route as needed
    }
    
    truncateText(text: string, maxLength: number): string {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
  
    calculateSRNumber(index: number): number {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  
    onPageSizeChange(event: Event): void {
      this.pageSize = +(event.target as HTMLSelectElement).value;
      this.getComplaints();
    }
  
    changePage(page: number): void {
      if (page > 0 && page <= this.pageCount) {
        this.currentPage = page;
        this.getComplaints();
      }
    }
  
    get pageCount(): number {
      return Math.ceil(this.totalComplaintCount / this.pageSize);
    }
  
    onSearch(): void {
      if (this.searchQuery.trim()) {
        const searchLower = this.searchQuery.toLowerCase();
        this.filteredComplaints = this.complaints.filter((complaint) =>
          complaint.title.toLowerCase().includes(searchLower)
        );
        this.isSearch = true;
      } else {
        this.resetSearch();
      }
    }
  
    resetSearch(): void {
      this.searchQuery = '';
      this.filteredComplaints = [...this.complaints];
      this.isSearch = false;
    }
  }
  