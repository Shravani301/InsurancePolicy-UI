import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-claims',
  templateUrl: './view-claim.component.html',
  styleUrls: ['./view-claim.component.css'],
})
export class ViewClaimComponent implements OnInit {
  claimData: any[] = [];
  filteredClaimData: any[] = [];
  policyData: any = {};

  // Pagination
  totalClaimCount: number = 0;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 15, 20, 30, 40, 50];
  pageSize: number = this.pageSizes[0];
  totalPages: number = 1;

  // Search and Sorting
  searchQuery: string = '';
  isSearch: boolean = false;
  sortColumn: string = 'claimDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Reject Box State
  showRejectBox: boolean = false;
  selectedClaimId: string = '';
  rejectReason: string = '';

  constructor(private adminService: AdminService, private location: Location) {}

  ngOnInit(): void {
    this.getClaims();
  }

  goBack(): void {
    this.location.back();
  }

  getClaims(): void {
    this.adminService.getClaims(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const headers = response.headers;
        this.currentPage = parseInt(headers.get('X-Current-Page') || '1', 10);
        this.totalPages = parseInt(headers.get('X-Total-Pages') || '1', 10);

        this.claimData = response.body || [];
        this.filteredClaimData = [...this.claimData];
        this.sortClaims();
      },
      error: () => {
        this.claimData = [];
        this.filteredClaimData = [];
      },
    });
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getClaims();
  }

  toggleRejectBox(claimId: string = ''): void {
    this.showRejectBox = !this.showRejectBox;
    this.selectedClaimId = claimId;
    this.rejectReason = '';
  }

  rejectClaim(): void {
    this.adminService.rejectClaim(this.selectedClaimId, this.rejectReason).subscribe({
      next: () => {
        this.getClaims();
        this.toggleRejectBox(); // Close the box after successful rejection
      },
      error: () => console.error('Error rejecting claim'),
    });
  }

  showPolicy(index: number): void {
    this.policyData = this.filteredClaimData[index];
  }

  approveClaim(claimId: string): void {
    this.adminService.approveClaim(claimId).subscribe({
      next: () => this.getClaims(),
      error: () => console.error('Error approving claim'),
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredClaimData = this.claimData.filter((claim) =>
        claim.claimId.toString().includes(this.searchQuery)
      );
      this.isSearch = true;
    } else {
      this.resetSearch();
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.isSearch = false;
    this.filteredClaimData = [...this.claimData];
    this.sortClaims();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getClaims();
    }
  }

  sortClaims(): void {
    this.filteredClaimData.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSort(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortClaims();
  }
}
