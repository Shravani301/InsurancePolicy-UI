import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-show-customers',
  templateUrl: './show-customers.component.html',
  styleUrls: ['./show-customers.component.css']
})
export class ShowCustomersComponent implements OnInit {
  customerData: any[] = [];
  filteredCustomerData: any[] = []; // Store filtered data
  totalCustomerCount: number = 0;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 15, 20, 30, 40, 50];
  pageSize: number = this.pageSizes[0];
  searchQuery: string = '';
  isSearch: boolean = false;
  totalPages: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;
  agentId:any='';
  constructor(private agent:AgentService, private location: Location,
    private toastService: ToastService,private router: Router
  ) {}

  ngOnInit(): void {
    this.agentId = localStorage.getItem('id'); // Initialize agentId first
    if (!this.agentId) {
      this.toastService.showToast('error', 'Agent ID is not available.');
      return; // Stop execution if agentId is not available
    }
    console.log('Agent ID:', this.agentId); // Debugging: Check the value of agentId
    this.getCustomers(); // Call getCustomers after agentId is initialized
  }
  
  getCustomers(): void {
    if (!this.agentId) {
      this.toastService.showToast('error', 'Agent ID is not available.');
      return;
    }
  
    this.agent.getCustomersByAgentId(this.agentId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const headers = {
          currentPage: parseInt(response.headers.get('X-Current-Page') || '1', 10),
          hasNext: response.headers.get('X-Has-Next') === 'true',
          hasPrevious: response.headers.get('X-Has-Previous') === 'true',
          totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
          totalCount: parseInt(response.headers.get('X-Total-Count') || '0', 10),
        };
  
        this.currentPage = headers.currentPage;
        this.hasNext = headers.hasNext;
        this.hasPrevious = headers.hasPrevious;
        this.totalPages = headers.totalPages;
        this.totalCustomerCount = headers.totalCount;
  
        this.customerData = response.body || [];
        this.filteredCustomerData = [...this.customerData];
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.toastService.showToast('error', 'Customer not available');
        this.customerData = [];
        this.filteredCustomerData = [];
        this.totalCustomerCount = 0;
        this.totalPages = 0;
        this.hasNext = false;
        this.hasPrevious = false;
      },
    });
  }
  
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getCustomers();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredCustomerData = this.customerData.filter((customer) => {
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
  goBack(): void {
    this.location.back();
  }
  resetSearch(): void {
    this.searchQuery = '';
    this.isSearch = false;
    this.filteredCustomerData = [...this.customerData]; // Reset filtered data to original customer data
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCustomers();
    }
  }

  // viewDocument(customer: any): void {
  //   console.log('View documents for:', customer);    
  //   if(customer.customerId)
  //   {
  //     this.router.navigate(['admin/customer/documnets/', customer.customerId]);
  //   }
  //   else
  //     this.toastService.showToast('error', 'Invalid plan selected.');
  // }

  // viewPolicies(customer: any): void {
  //   console.log('View policies for:', customer); 
  //   if(customer.customerId)
  //   {
  //     this.router.navigate(['admin/customer/policies/', customer.customerId]);
  //   }
  //   else
  //     this.toastService.showToast('error', 'Invalid plan selected.');

  // }
}
