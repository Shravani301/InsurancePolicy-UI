import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { AgentService } from 'src/app/services/agent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-commissions',
  templateUrl: './view-commissions.component.html',
  styleUrls: ['./view-commissions.component.css']
})
export class ViewCommissionsComponent implements OnInit {
  pageSizes = [5, 10, 15, 20, 25];
  pageSize = this.pageSizes[0]; // Default page size
  currentPage = 1; // Current page number
  totalCommissionCount = 0; // Total number of commissions
  commissions: any[] = []; // All commissions fetched from the API
  filteredCommissions: any[] = []; // Commissions filtered by search
  searchQuery: string = ''; // Search query
  filterBy: string = 'agentName'; // Default filter by Agent Name
  agentId: any | null = ''; // Agent ID fetched from localStorage

  constructor(
    private agent:AgentService,
    private location: Location,
    private toastService: ToastService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.agentId = localStorage.getItem('id');
    this.getCommissionsByAgentId();
  }

  goBack(): void {
    this.location.back();
  }

  // Fetch commissions by agent ID with pagination
  getCommissionsByAgentId(): void {
    if (!this.agentId) {
      console.error('Agent ID is not available in localStorage');
      return;
    }

    this.agent.getCommissionsByAgentId(this.agentId).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        if (paginationHeader) {
          const paginationData = JSON.parse(paginationHeader);
          this.totalCommissionCount = paginationData.TotalCount;
        }
        this.commissions = response.body || [];
        this.filteredCommissions = [...this.commissions];
        console.log('Commissions fetched:', this.commissions);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch commissions', error);
        this.commissions = [];
        this.filteredCommissions = [];
      }
    });
  }

  // Change page and fetch new data
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getCommissionsByAgentId();
  }

  // Change page size and fetch new data
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1; // Reset to first page when page size changes
    this.getCommissionsByAgentId();
  }

  // Calculate total pages
  get totalPages(): number {
    return Math.ceil(this.totalCommissionCount / this.pageSize);
  }

  // Generate page numbers for pagination
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Search functionality
  onSearch(): void {
    const lowerQuery = this.searchQuery.toLowerCase();
    this.filteredCommissions = this.commissions.filter((commission) =>
      commission.agentName.toLowerCase().includes(lowerQuery)
    );
  }

  // Reset search and show all commissions
  resetSearch(): void {
    this.searchQuery = '';
    this.filteredCommissions = [...this.commissions];
  }

  // Calculate serial number for the current page
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  withdraw()
  {
    this.route.navigate(['agent/withdrawls']);
  }
}
