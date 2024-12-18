import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-view-scheme',
  templateUrl: './view-scheme.component.html',
  styleUrls: ['./view-scheme.component.css'],
})
export class ViewSchemeComponent implements OnInit {
  pageSize = 10;
  currentPage = 1;
  totalSchemeCount = 0;
  totalPages=0;
  planSchemes: any[] = [];
  pageSizes = [5, 10, 15, 20, 25];
  searchQuery: string = '';
  isSearch = false;
  planId!: any;
  userRole: string = ''; // To store the role of the logged-in user  
  maxVisiblePages: number = 3; // Maximum number of pages to display
  constructor(
    private admin: AdminService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.getUserRole(); // Retrieve user role
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.planId = idParam;
      this.getSchemes();
    } else {
      console.error('Missing planId in route parameters');
      this.router.navigate(['/error']);
    }
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

  // Retrieve user role from localStorage
  getUserRole(): void {
    const role = localStorage.getItem('role');
    this.userRole = role ? role : 'user'; // Default to 'user' if role is not set
  }

  getSchemes(): void {
    this.admin
      .getSchemeByPlanID(this.planId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          const headers = {
            currentPage: parseInt(response.headers.get('X-Current-Page') || '1', 10),
            hasNext: response.headers.get('X-Has-Next') === 'true',
            hasPrevious: response.headers.get('X-Has-Previous') === 'true',
            totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
          };

          this.currentPage = headers.currentPage;
          this.totalSchemeCount = headers.totalPages * this.pageSize;
          this.planSchemes = response.body || [];
          this.totalPages = headers.totalPages;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch schemes:', err);
          this.planSchemes = [];
        },
      });
  }

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  get pageCount(): number {
    return Math.ceil(this.totalSchemeCount / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages)
      {
      this.currentPage = page;
      this.getSchemes();
    }
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getSchemes();
  }

  onSearch(): void {
    this.getSchemes();
    this.isSearch = true;
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.isSearch = false;
    this.getSchemes();
  }

  goBack(): void {
    this.location.back();
  }

  addScheme(): void {
    this.router.navigateByUrl(`/admin/addScheme/${this.planId}`);
  }
  

 
  editScheme(scheme: any): void {
    scheme.isEditing = true; // Enable editing mode
  }
  
  saveScheme(scheme: any): void {
    const isValid =
      scheme.schemeName &&
      scheme.minAmount >= 500 &&
      scheme.maxAmount > scheme.minAmount &&
      scheme.minAge >= 18 &&
      scheme.maxAge > scheme.minAge &&
      scheme.minInvestTime >= 1 &&
      scheme.maxInvestTime > scheme.minInvestTime &&
      scheme.profitRatio >= 0 &&
      scheme.profitRatio <= 25 &&
      scheme.registrationCommRatio >= 0 &&
      scheme.registrationCommRatio <= 40 &&
      scheme.installmentCommRatio >= 0 &&
      scheme.installmentCommRatio <= 7.5;
      scheme.claimDeductionPercentage>=0 &&
      scheme.claimDeductionPercentage<=30;
      scheme.penaltyDeductionPercentage>=0 &&
      scheme.penaltyDeductionPercentage<=100;
  
    if (!isValid) {
      alert('Please fix validation errors before saving.');
      return;
    }
  
    this.updateSchemeData(scheme);
  }
  
  
  updateSchemeData(scheme: any): void {
    // Create a shallow copy of the scheme object
    const schemeToUpdate = { ...scheme };
    //const { planName, ...finalData } = schemeToUpdate
      
    // Remove the isEditing property
    delete schemeToUpdate.isEditing;
    delete schemeToUpdate.planName;
  
    // Add the planId to the object
    schemeToUpdate.planId = this.planId;
  
    // API call to update the scheme
    this.admin.updateScheme(schemeToUpdate).subscribe({
      next: () => {
        this.toastService.showToast("success",'Scheme updated successfully');
        this.getSchemes(); // Refresh the schemes list if necessary
      },
      error: (err) => {
        this.toastService.showToast('error',err.error?.errorMessage||'Failed to update scheme.');
        console.error('Error updating scheme:', err);
      },
    });
  }
  registerScheme(): void {
    this.router.navigateByUrl(`/admin/addScheme/${this.planId}`);
  }
  

  showDeactivateModal = false;
showActivateModal = false;
selectedScheme: any = null;

togglePlanStatus(scheme: any): void {
  this.selectedScheme = scheme;
  if (scheme.status) {
    this.showDeactivateModal = true;
  } else {
    this.showActivateModal = true;
  }
}

confirmDeactivation(): void {
  this.showDeactivateModal = false;
    this.admin.deleteScheme(this.selectedScheme.schemeId).subscribe({
      next: () => {
        this.toastService.showToast('success','Scheme Deactivated successfully.');
        this.getSchemes();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to deactivate scheme:', err);
        this.toastService.showToast('error',err.error?.errorMessage||'Failed to deactivate scheme.');
        
      },
    });
}


confirmActivation(): void {
  this.showActivateModal = false;
  // Call API to activate
  this.admin.activateScheme(this.selectedScheme.schemeId).subscribe({
    next: () => {
      this.toastService.showToast('success', 'scheme activated successfully.');
      this.getSchemes();
    },
    error: (err) => {
      console.error('Failed to activate scheme:', err);
      this.toastService.showToast('error', 'Failed to activate the scheme.');
    },
  });
}

closeDeactivateModal(): void {
  this.showDeactivateModal = false;
}

closeActivateModal(): void {
  this.showActivateModal = false;
}

showCancelEditModal = false;
editingScheme: any = null;

confirmCancelEdit(scheme: any): void {
  this.showCancelEditModal = true;
  this.editingScheme = scheme;
}

discardChanges(): void {
  this.showCancelEditModal = false;
  if (this.editingScheme) {
    // Reset changes by fetching the latest scheme details
    this.getSchemes();
    this.editingScheme.isEditing = false;
    this.editingScheme = null;
  }
}

closeCancelEditModal(): void {
  this.showCancelEditModal = false;
}

}
