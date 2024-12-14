import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css'],
})
export class ViewPlanComponent implements OnInit {
  plans: any[] = [];
  filteredPlans: any[] = [];
  totalPlanCount = 0;
  currentPage = 1;
  pageSizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  pageSize = this.pageSizes[0];
  searchQuery = '';
  isSearch = false;
  maxVisiblePages: number = 3; // Maximum number of pages to display
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  selectedPlan: any; // Store the selected plan for modal actions
  

  constructor(
    private admin: AdminService,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
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

        this.plans = response.body || [];
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
      this.router.navigate(['/admin/viewScheme', plan.planId]);
    } else {
      this.toastService.showToast('error', 'Invalid plan selected.');
    }
  }

  registerPlan(): void {
    this.router.navigateByUrl('/admin/addPlan');
  }

  addScheme(plan:any): void {
    this.router.navigateByUrl(`/admin/addScheme/${plan.planId}`);
  }
  onDelete(plan: any): void {
    if (confirm('Are you sure you want to deactivate this plan?')) {
      this.admin.deletePlan(plan.planId).subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          this.toastService.showToast('success', 'Plan deactivated successfully.');
          this.getPlans(); // Reload the updated list of plans
        },
        error: (err) => {
          console.error('Error object:', err);
          this.toastService.showToast('error', 'Failed to deactivate the plan.');
        },
      });
    }
  }
  

  // togglePlanStatus(plan: any): void {
  //   if (plan.status) {
  //     // Call the delete API for deactivation
  //     this.onDelete(plan);
  //   } else {
  //     // Call the activate API
  //     if (confirm('Are you sure you want to activate this plan?')) {
  //       this.admin.activatePlan(plan.planId).subscribe({
  //         next: () => {
  //           this.toastService.showToast('success', 'Plan activated successfully.');
  //           this.getPlans();
  //         },
  //         error: (err) => {
  //           console.error('Failed to activate plan:', err);
  //           this.toastService.showToast('error', 'Failed to activate the plan.');
  //         },
  //       });
  //     }
  //   }
  // }
  showDeactivateModal: boolean = false; // Control deactivation modal visibility
  showActivateModal: boolean = false; // Control activation modal visibility

  // Existing properties and constructor...

  togglePlanStatus(plan: any): void {
    this.selectedPlan = plan;
    if (plan.status) {
      // Open deactivation modal
      this.showDeactivateModal = true;
    } else {
      // Open activation modal
      this.showActivateModal = true;
    }
  }

  confirmDeactivation(): void {
    this.admin.deletePlan(this.selectedPlan.planId).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Plan deactivated successfully.');
        this.getPlans();
        this.closeDeactivateModal();
      },
      error: (err) => {
        console.error('Failed to deactivate plan:', err);
        this.toastService.showToast('error', 'Failed to deactivate the plan.');
      },
    });
  }

  confirmActivation(): void {
    this.admin.activatePlan(this.selectedPlan.planId).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Plan activated successfully.');
        this.getPlans();
        this.closeActivateModal();
      },
      error: (err) => {
        console.error('Failed to activate plan:', err);
        this.toastService.showToast('error', 'Failed to activate the plan.');
      },
    });
  }

  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
    this.selectedPlan = null;
  }

  closeActivateModal(): void {
    this.showActivateModal = false;
    this.selectedPlan = null;
  }
}
