import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-show-plans',
  templateUrl: './show-plans.component.html',
  styleUrls: ['./show-plans.component.css']
})
export class ShowPlansComponent {

  plans: any[] = [];
  filteredPlans: any[] = [];
  totalPlanCount = 0;
  currentPage = 1;
  pageSizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  pageSize = this.pageSizes[0];
  searchQuery = '';
  isSearch = false;
  role:any='';

  totalPages = 0;
  hasNext = false;
  hasPrevious = false;

  constructor(
    private admin: AdminService,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.getPlans();
  }

  goBack(): void {
    this.location.back();
  }
  getPlans(): void {
    this.admin.getPlans(this.currentPage, this.pageSize).subscribe({
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
        this.totalPlanCount = headers.totalCount;
  
        // Filter plans to only include active ones
        const allPlans = response.body || [];
        this.plans = allPlans.filter((plan: any) => plan.status === true);
        this.filteredPlans = [...this.plans];
      },
      error: (err) => {
        console.error('Failed to fetch plans:', err);
        this.resetPagination();
      },
    });
  }
  

  resetPagination(): void {
    this.plans = [];
    this.filteredPlans = [];
    this.totalPlanCount = 0;
    this.totalPages = 0;
    this.hasNext = false;
    this.hasPrevious = false;
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getPlans();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredPlans = this.plans.filter((plan) => {
        return (
          plan.planId.toString().toLowerCase().includes(query) ||
          (plan.planName && plan.planName.toLowerCase().includes(query))
        );
      });
      this.isSearch = true;
    } else {
      this.resetSearch();
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.isSearch = false;
    this.filteredPlans = [...this.plans];
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getPlans();
    }
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  viewScheme(plan: any): void {
    if (plan && plan.planId) {
      if(this.role==='Customer')  
        this.router.navigate(['customer/viewScheme/', plan.planId]);
      else if(this.role==='Agent')
        this.router.navigate(['agent/viewScheme/', plan.planId]);
      } else {
      this.toastService.showToast('error', 'Invalid plan selected.');
    }
  }

  registerPlan(): void {
    this.router.navigateByUrl('/admin/addPlan');
  }  
}
