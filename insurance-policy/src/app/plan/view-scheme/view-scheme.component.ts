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
  

  deleteScheme(schemeId: number): void {
    if (confirm('Are you sure you want to delete this scheme?')) {
      this.admin.deleteScheme(schemeId).subscribe({
        next: () => {
          alert('Scheme deleted successfully.');
          this.getSchemes();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to delete scheme:', err);
          alert('Failed to delete scheme.');
        },
      });
    }
  }
  editScheme(scheme: any): void {
    scheme.isEditing = true; // Enable editing mode
  }
  
  saveScheme(scheme: any): void {
    scheme.isEditing = false; // Disable editing mode
    // Perform API call to save changes
    this.updateSchemeData(scheme);
  }
  
  updateSchemeData(scheme: any): void {
    // Create a shallow copy of the scheme object
    const schemeToUpdate = { ...scheme };
  
    // Remove the isEditing property
    delete schemeToUpdate.isEditing;
  
    // Add the planId to the object
    schemeToUpdate.planId = this.planId;
  
    // API call to update the scheme
    this.admin.updateScheme(schemeToUpdate).subscribe({
      next: () => {
        alert('Scheme updated successfully');
        this.getSchemes(); // Refresh the schemes list if necessary
      },
      error: (err) => {
        console.error('Error updating scheme:', err);
      },
    });
  }
  registerScheme(): void {
    this.router.navigateByUrl(`/admin/addScheme/${this.planId}`);
  }
  

  togglePlanStatus(scheme: any): void {
    if (scheme.status) {
      // Call the delete API for deactivation
      this.deleteScheme(scheme.schemeId);
    } else {
      // Call the activate API
      if (confirm('Are you sure you want to activate this scheme?')) {
        this.admin.activateScheme(scheme.schemeId).subscribe({
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
    }
  }
}
