import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-scheme',
  templateUrl: './view-scheme.component.html',
  styleUrls: ['./view-scheme.component.css'],
})
export class ViewSchemeComponent implements OnInit {
  pageSize = 10;
  currentPage = 1;
  totalSchemeCount = 0;
  planSchemes: any[] = [];
  pageSizes = [5, 10, 15, 20, 25];
  searchQuery: string = '';
  isSearch = false;
  planId!: any;
  userRole: string = ''; // To store the role of the logged-in user

  constructor(
    private admin: AdminService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
    if (page >= 1 && page <= this.pageCount) {
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
    this.router.navigateByUrl(`/admin/add/scheme/${this.planId}`);
  }
  
  // buyPolicy(scheme: any): void {
  //   console.log('Buying policy for scheme:', scheme);
  //   // Add your logic to navigate or handle the buy policy action
  // }
  UpdateSchemeData(scheme: any): void {
    this.router.navigateByUrl(`/admin/update/scheme/${scheme.schemeId}`);
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
}
