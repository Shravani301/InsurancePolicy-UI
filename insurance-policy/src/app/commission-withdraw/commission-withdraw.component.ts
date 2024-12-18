import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-commission-withdraw',
  templateUrl: './commission-withdraw.component.html',
  styleUrls: ['./commission-withdraw.component.css'],
})
export class CommissionWithdrawComponent implements OnInit {
  pageSizes = [5, 10, 15, 20, 25];
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalCommissionCount = 0;
  commissions: any[] = [];
  filteredCommissions: any[] = [];
  totalPages:any='';
  searchQuery: string = '';
  filterBy: string = 'agentName'; // Default filter by Agent Name
  showTotalCommissions: { [key: string]: boolean } = {};
  isSearch = false;
  showRejectBox = false;
  selectedRequestId: string = '';
  rejectReason: string = '';
  role:any='';

  constructor(private adminService: AdminService, private location: Location,private toastService:ToastService) {}

  ngOnInit(): void {
    this.getWithdrawalRequests();
    const storedRole=localStorage.getItem('role');
    this.role=storedRole;
  }

  goBack(): void {
    this.location.back();
  }

  getWithdrawalRequests(): void {
    this.adminService.getWithdrawalRequests(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        this.totalPages = parseInt(response.headers.get('x-total-pages') || '1', 10);
                
        if (paginationHeader) {
          const paginationData = JSON.parse(paginationHeader);
          this.totalCommissionCount = paginationData.TotalCount;
        }
        this.commissions = response.body || [];
        this.filteredCommissions = [...this.commissions];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch withdrawal requests', error);
        this.commissions = [];
        this.filteredCommissions = [];
      },
    });
  }

  approveWithdrawal(requestId: string): void {
    this.adminService.approveWithdrawalRequest(requestId).subscribe({
      next: () => {
        this.toastService.showToast("success",'Withdrawal request approved successfully.');
        this.getWithdrawalRequests();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error",'Failed to approve the withdrawal request.');
        console.error(error);
      },
    });
  }

  toggleRejectBox(requestId: string = ''): void {
    this.selectedRequestId = requestId;
    this.showRejectBox = !this.showRejectBox;
  }

  rejectWithdrawal(requestId: string): void {
    this.adminService.rejectWithdrawalRequest(requestId).subscribe({
      next: () => {
        alert('Withdrawal request rejected successfully.');
        this.toggleRejectBox();
        this.getWithdrawalRequests();
      },
      error: (error: HttpErrorResponse) => {
        alert('Failed to reject the withdrawal request.');
        console.error(error);
      },
    });
  }
  
  toggleTotalCommission(requestId: any): void {
    // Check if the commission is already toggled
    if (this.showTotalCommissions[requestId]) {
      // Hide the commission by toggling to `false`
      this.showTotalCommissions[requestId] = false;
    } else {
      // Fetch the commission from the API
      this.adminService.getTotalCommissionByAgent(requestId).subscribe({
        next: (response) => {
          const totalCommission = response.body.totalCommission; // Extract the total commission
          this.showTotalCommissions[requestId] = totalCommission; // Save it for display
        },
        error: () => {
          console.error('Failed to fetch total commission');
        },
      });
    }
  }
  

  onSearch(): void {
    const lowerQuery = this.searchQuery.toLowerCase();
    this.filteredCommissions = this.commissions.filter((commission) => {
      return (
        commission.agentName.toLowerCase().includes(lowerQuery) ||
        commission.customerName.toLowerCase().includes(lowerQuery)
      );
    });
  }

  applyFilter(): void {
    this.filteredCommissions = this.commissions.filter((commission) =>
      commission[this.filterBy]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.filteredCommissions = [...this.commissions];
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getWithdrawalRequests();
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
    this.getWithdrawalRequests();
  }
  maxVisiblePages: number = 3; // Maximum number of pages to display
 

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  // get totalPages(): number {
  //   return Math.ceil(this.totalCommissionCount / this.pageSize);
  // }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
