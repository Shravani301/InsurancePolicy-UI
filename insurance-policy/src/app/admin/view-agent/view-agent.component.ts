import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.css'],
})
export class ViewAgentComponent implements OnInit {
  agents: any[] = [];
  filteredAgents: any[] = []; // Filtered agents for displaying search results
  totalAgentCount = 0;
  currentPage = 1;
  pageSize = 5;
  pageSizes = [5, 10, 15, 20];
  searchQuery: string = '';
  isSearch = false;

  showInactivateModal = false;
  selectedAgent: any = null;

  constructor(
    private admin: AdminService,
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
    this.admin.getFilterAgents(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        if (paginationHeader) {
          const paginationData = JSON.parse(paginationHeader);
          this.totalAgentCount = paginationData.TotalCount;
        }
        this.agents = response.body || [];
        this.filteredAgents = [...this.agents]; // Initialize filteredAgents with all agents
      },
      error: () => {
        this.toastService.showToast('error', 'Failed to load agents.');
        this.agents = [];
        this.filteredAgents = [];
      },
    });
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAgents();
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.pageCount) {
      this.currentPage = page;
      this.getAgents();
    }
  }

  get pageCount(): number {
    return Math.ceil(this.totalAgentCount / this.pageSize);
  }

  toggleAgentStatus(agent: any): void {
    if (agent.status) {
      this.selectedAgent = agent;
      this.showInactivateModal = true;
    } else {
      this.activateAgent(agent);
    }
  }

  activateAgent(agent: any): void {
    this.admin.activateAgent(agent.agentId).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Agent activated successfully.');
        this.getAgents();
      },
      error: () => {
        this.toastService.showToast('error', 'Failed to activate the agent.');
      },
    });
  }

  inactivateAgent(): void {
    if (this.selectedAgent) {
      this.admin.deleteAgent(this.selectedAgent.agentId).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Agent inactivated successfully.');
          this.closeModal();
          this.getAgents();
        },
        error: () => {
          this.toastService.showToast('error', 'Failed to inactivate the agent.');
        },
      });
    }
  }

  closeModal(): void {
    this.showInactivateModal = false;
    this.selectedAgent = null;
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

  addAgent(): void {
    this.router.navigateByUrl('admin/agent');
  }
}