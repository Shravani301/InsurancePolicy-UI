import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';

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
  searchQuery: string = '';
  filterBy: string = 'agentName'; // Default filter by Agent Name
  showTotalCommissions: { [key: string]: boolean } = {};
  isSearch = false;
  showRejectBox = false;
  selectedRequestId: string = '';
  rejectReason: string = '';

  constructor(private adminService: AdminService, private location: Location) {}

  ngOnInit(): void {
    this.getWithdrawalRequests();
  }

  goBack(): void {
    this.location.back();
  }

  getWithdrawalRequests(): void {
    this.adminService.getWithdrawalRequests(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
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
        alert('Withdrawal request approved successfully.');
        this.getWithdrawalRequests();
      },
      error: (error: HttpErrorResponse) => {
        alert('Failed to approve the withdrawal request.');
        console.error(error);
      },
    });
  }

  toggleRejectBox(requestId: string = ''): void {
    this.selectedRequestId = requestId;
    this.showRejectBox = !this.showRejectBox;
  }

  rejectWithdrawal(): void {
    if (!this.rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    this.adminService.rejectWithdrawalRequest(this.selectedRequestId, this.rejectReason).subscribe({
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

  toggleTotalCommission(requestId: string): void {
    this.showTotalCommissions[requestId] = !this.showTotalCommissions[requestId];
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
    this.currentPage = page;
    this.getWithdrawalRequests();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getWithdrawalRequests();
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.totalCommissionCount / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
