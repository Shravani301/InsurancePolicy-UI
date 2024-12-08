import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-policies',
  templateUrl: './view-policies.component.html',
  styleUrls: ['./view-policies.component.css']
})
export class ViewPoliciesComponent {
  customerData: any;
  searchQuery!: string; // Changed to string for scheme name search
  currentPage = 1;
  totalPolicyCount = 0;
  policies: any[] = [];
  pageSizes: number[] = [5, 10, 20, 30];
  pageSize = this.pageSizes[0];
  isSwitchOn = true; // Controls whether to show purchased or applied policies

  constructor(private customer: CustomerService, private router: Router, private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getPolicies();
  }

  getPolicies() {
    const userId = localStorage.getItem("id")!;
    this.customer.getPolicies(userId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        if (paginationHeader) {
          const paginationData = JSON.parse(paginationHeader);
          this.totalPolicyCount = paginationData.TotalCount;
        }
        this.policies = response.body || [];
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.policies = [];
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery && this.searchQuery.toString().trim()) {
      const searchLower = this.searchQuery.toLowerCase();

      // Filter the policies array based on the scheme name
      this.policies = this.policies.filter((policy) =>
        policy.insuranceSchemeName?.toLowerCase().includes(searchLower)
      );

      if (this.policies.length === 0) {
        this.toastService.showToast("error","No policies found matching the scheme name.");
      }
    } else {
      this.resetSearch(); // Reset search if query is empty
    }
  }

  resetSearch(): void {
    this.searchQuery = ''; // Clear the search query
    this.getPolicies(); // Reload the policies from the server
  }

  changePage(page: number) {
    if (page === this.currentPage) return; // Prevent duplicate API calls
    this.currentPage = page;
    this.getPolicies();
  }

  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1; // Reset to the first page
    this.getPolicies();
  }

  toggleSwitch(state: boolean) {
    if (this.isSwitchOn === state) return; // Avoid redundant calls
    this.isSwitchOn = state;
    this.getPolicies();
  }

  goBack() {
    this.location.back();
  }

  viewPolicy(policy: any) {
    this.router.navigateByUrl(`customer/Policy/${policy.policyNo}`);
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  get pageCount(): number {
    return Math.ceil(this.totalPolicyCount / this.pageSize);
  }

  buyPolicy(policy: any) {
    if (!this.customerData?.documents) {
      this.toastService.showToast("warn","Customer documents are not available or verified.");
      return;
    }
    this.router.navigateByUrl(`customer/policy/pay/${policy.policyNo}`);
  }
}
