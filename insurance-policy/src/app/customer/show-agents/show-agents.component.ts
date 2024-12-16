import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-show-agents',
  templateUrl: './show-agents.component.html',
  styleUrls: ['./show-agents.component.css']
})
export class ShowAgentsComponent {
  agents: any[] = [];
  filteredAgents: any[] = []; // Filtered agents for displaying search results
  totalAgentCount = 0;
  currentPage = 1;
  pageSize = 5;
  pageSizes = [5, 10, 15, 20];
  searchQuery: string = '';
  isSearch = false;  
  maxVisiblePages: number = 3; // Maximum number of pages to display
  totalPages: number = 0;

  showInactivateModal = false;
  selectedAgent: any = null;

  constructor(
    private customer:CustomerService,
    private location: Location,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAgents();
  }

  goBack(): void {
    this.location.back();
  }

  getAgents(): void {
    const customerId = localStorage.getItem('id'); // Retrieve customer ID from localStorage
  
    if (!customerId) {
      this.toastService.showToast('error', 'Customer ID is missing.');
      return;
    }
  
    this.customer.getFilterAgentsByCustomer(this.currentPage, this.pageSize, customerId).subscribe({
      next: (response) => {
        const headers = {
          currentPage: parseInt(response.headers.get('X-Current-Page') || '1', 10),
          hasNext: response.headers.get('X-Has-Next') === 'true',
          hasPrevious: response.headers.get('X-Has-Previous') === 'true',
          totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
          totalCount: parseInt(response.headers.get('X-Total-Count') || '0', 10),
        };
        this.totalPages=parseInt(response.headers.get('X-Total-Pages') || '0', 10);
        this.agents = response.body || [];
        this.filteredAgents = [...this.agents]; // Initialize filteredAgents with all agents
      },
      error: () => {
        this.toastService.showToast('error', 'Agents is not available');
        this.agents = [];
        this.filteredAgents = [];
      },
    });
  }
  
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAgents();
    }
  }

  get pageCount(): number {
    return Math.ceil(this.totalAgentCount / this.pageSize);
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
    this.getAgents();
  }
  toggleAgentStatus(agent: any): void {
    if (agent.status) {
      this.selectedAgent = agent;
      this.showInactivateModal = true;
    } else {
      
    }
  }


  onSearch(): void {
    if (this.searchQuery.trim()) {
      const searchLower = this.searchQuery.toLowerCase();
      console.log('Search Query:', searchLower); // Debug search query

      // Filter the agents array based on the search query
      this.filteredAgents = this.agents.filter((agent) => {
        console.log('Checking Agent:', agent); // Debug each agent
        return (
          agent.agentFirstName?.toLowerCase().includes(searchLower) ||
          agent.agentLastName?.toLowerCase().includes(searchLower)
        );
      });

      this.isSearch = true; // Mark search as active
    } else {
      this.resetSearch(); // Reset search if query is empty
    }
  }

  resetSearch(): void {
    this.searchQuery = ''; // Clear the search query
    this.filteredAgents = [...this.agents]; // Reset filtered list to all agents
    this.isSearch = false; // Mark search as inactive
  }
}
