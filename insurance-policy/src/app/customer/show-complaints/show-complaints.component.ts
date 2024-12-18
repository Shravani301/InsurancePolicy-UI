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
    totalPages: number = 0;      
    maxVisiblePages: number = 3; // Maximum number of pages to display
    customerId:any='';
    constructor(
      private customer:CustomerService,
      private location: Location,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.getComplaints();
      const storedId= localStorage.getItem('id');
      if(!storedId)
        return;
      this.customerId=storedId;
      console.log(this.customerId)
    }
  
    goBack(): void {
      this.location.back();
    }
  
    getComplaints(): void {
      console.log('Customer ID:', this.customerId);
      const userId = localStorage.getItem('id');
      this.customerId = userId;
    
      this.customer.getComplaintsByCustomerId(this.customerId, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            console.log('API Response:', response); // Log full API response
    
            // Since response is an array, directly assign it to complaints
            this.complaints = response || [];
            this.filteredComplaints = [...this.complaints];
            this.totalComplaintCount = this.complaints.length;
            this.totalPages = Math.ceil(this.totalComplaintCount / this.pageSize);
            console.log('FilteredComplaints:', this.filteredComplaints);
          },
          error: (err) => {
            console.error('API Error:', err);
            this.complaints = [];
            this.filteredComplaints = [];
          }
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
  
    changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getComplaints();
    }
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
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getComplaints();
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
    selectedComplaint: any = null; // Store the complaint to display in the modal

    // Open the modal and store the selected complaint
    openResponseModal(complaint: any): void {
      this.selectedComplaint = complaint;
    
      const modalElement = document.getElementById('responseModal');
      if (modalElement) {
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.style.zIndex = '1050';
        document.body.classList.add('modal-open'); // Prevent background scroll
      }
    }
    
    // Close the modal and clear the selected complaint
    closeResponseModal(): void {
      const modalElement = document.getElementById('responseModal');
      if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
      this.selectedComplaint = null;
    }
    
    resetSearch(): void {
      this.searchQuery = '';
      this.filteredComplaints = [...this.complaints];
      this.isSearch = false;
    }
  }
  