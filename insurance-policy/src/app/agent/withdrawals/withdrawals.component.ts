import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.css']
})
export class WithdrawalsComponent implements OnInit {
  pageSizes = [5, 10, 15, 20, 25];
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalCommissionCount = 0;
  commissions: any[] = [];
  filteredCommissions: any[] = [];
  searchQuery: string = '';
  filterBy: string = 'agentName';
  showTotalCommissions: { [key: string]: number } = {};
  totalCommission: number = 0;
  isSearch = false;
  showRejectBox = false;
  showWithdrawModal = false;
  selectedRequest: any = null;
  withdrawAmount: number = 0;
  agentId: any = '';

  constructor(
    private adminService: AdminService,
    private agent: AgentService,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Fetch the agentId from localStorage
    const storedAgentId = localStorage.getItem('id');
    if (storedAgentId) {
      this.agentId = storedAgentId;
      console.log('Agent ID fetched from localStorage:', this.agentId);
      this.getTotalCommissionByAgent();
      this.getWithdrawalRequests();
    } else {
      console.error('Agent ID is missing in localStorage. Unable to fetch withdrawal requests.');
    }
  }

  goBack(): void {
    this.location.back();
  }

  getWithdrawalRequests(): void {
    this.agent.getWithdrawalRequestsByAgentId(this.agentId, this.currentPage, this.pageSize).subscribe({
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
      }
    });
  }

  getTotalCommissionByAgent(): void {
    this.adminService.getTotalCommissionByAgent(this.agentId).subscribe({
      next: (response) => {
        this.totalCommission = response.body?.totalCommission || 0;
        console.log('Total Commission:', this.totalCommission);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch total commission:', error);
      }
    });
  }

  toggleTotalCommission(requestId: any): void {
    if (this.showTotalCommissions[requestId]) {
      this.showTotalCommissions[requestId] = 0;
    } else {
      this.adminService.getTotalCommissionByAgent(requestId).subscribe({
        next: (response) => {
          const totalCommission = response.body.totalCommission;
          this.showTotalCommissions[requestId] = totalCommission;
        },
        error: () => {
          console.error('Failed to fetch total commission');
        },
      });
    }
  }

  approveWithdrawal(requestId: string): void {
    this.adminService.approveWithdrawalRequest(requestId).subscribe({
      next: () => {
        this.toastService.showToast("success", 'Withdrawal request approved successfully.');
        this.getWithdrawalRequests();
        this.getTotalCommissionByAgent(); // Refresh total commission
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", 'Failed to approve the withdrawal request.');
        console.error(error);
      }
    });
  }

  toggleRejectBox(requestId: string = ''): void {
    this.selectedRequest = requestId;
    this.showRejectBox = !this.showRejectBox;
  }

  rejectWithdrawal(requestId: string): void {
    this.adminService.rejectWithdrawalRequest(this.selectedRequest).subscribe({
      next: () => {
        alert('Withdrawal request rejected successfully.');
        this.toggleRejectBox();
        this.getWithdrawalRequests();
      },
      error: (error: HttpErrorResponse) => {
        alert('Failed to reject the withdrawal request.');
        console.error(error);
      }
    });
  }

  openWithdrawModal(request: any): void {
    this.selectedRequest = request;
    this.withdrawAmount = 0;
    this.showWithdrawModal = true;
  }

  closeWithdrawModal(): void {
    this.showWithdrawModal = false;
    this.selectedRequest = null;
    this.withdrawAmount = 0;
  }

  submitWithdrawRequest(): void {
    if (this.withdrawAmount <= 0 || this.withdrawAmount > this.totalCommission) {
      this.toastService.showToast("error", "Invalid withdrawal amount.");
      return;
    }

    const withdrawalRequest = {
      agentId: this.agentId,
      requestType: 1,
      amount: this.withdrawAmount,
      requestDate: new Date().toISOString(),
      status: 0,
      rejectedReason: 'Under Verification',
      totalCommission: this.totalCommission
    };
    
    this.agent.addWithdrawalRequest(withdrawalRequest).subscribe({
      next: () => {
        this.toastService.showToast("success", "Withdrawal request submitted successfully.");
        this.closeWithdrawModal();
        this.getWithdrawalRequests();
        this.getTotalCommissionByAgent(); // Refresh total commission
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Failed to submit the withdrawal request.");
        console.error(error);
      }
    });
  }
  openWithdrawModalForNewRequest(): void {
    this.selectedRequest = null; // Reset for a new request
    this.withdrawAmount = 0;
    this.showWithdrawModal = true;
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
