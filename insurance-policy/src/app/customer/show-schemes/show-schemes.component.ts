import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { forkJoin, map } from 'rxjs'; // Import forkJoin and map

@Component({
  selector: 'app-show-schemes',
  templateUrl: './show-schemes.component.html',
  styleUrls: ['./show-schemes.component.css']
})
export class ShowSchemesComponent implements OnInit {
  pageSize = 10;
  currentPage = 1;
  totalSchemeCount = 0;
  planSchemes: any[] = [];
  pageSizes = [5, 10, 15, 20, 25];
  searchQuery: string = '';
  isSearch = false;
  planId!: any;
  userRole: string = ''; // To store the role of the logged-in user
  customerId: number = parseInt(localStorage.getItem('id') || '0', 10); // Customer ID from local storage
  associatedSchemes: Record<number, boolean> = {}; // Store association status per scheme

  constructor(
    private admin: AdminService,
    private customerService: CustomerService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.planId = idParam;
      this.getSchemes();
    } else {
      console.error('Missing planId in route parameters');
      this.router.navigate(['/error']);
    }
  }

  getSchemes(): void {
    this.admin.getSchemeByPlanID(this.planId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const headers = {
          currentPage: parseInt(response.headers.get('X-Current-Page') || '1', 10),
          totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10)
        };

        this.currentPage = headers.currentPage;
        this.totalSchemeCount = headers.totalPages * this.pageSize;
        this.planSchemes = response.body || [];

        // Check association for all schemes
        this.checkSchemesAssociation();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch schemes:', err);
        this.planSchemes = [];
      }
    });
  }

  checkSchemesAssociation(): void {
    const requests = this.planSchemes.map((scheme) =>
      this.customerService
        .isCustomerAssociatedWithScheme(scheme.schemeId, this.customerId)
        .pipe(
          // Capture the scheme ID along with the response
          map((response) => ({ schemeId: scheme.schemeId, isAssociated: response.IsAssociated }))
        )
    );

    forkJoin(requests).subscribe({
      next: (results: { schemeId: number; isAssociated: boolean }[]) => {
        results.forEach((result) => {
          this.associatedSchemes[result.schemeId] = result.isAssociated;
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to check scheme associations:', err);
      }
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

  buyPolicy(scheme: any): void {
    this.router.navigateByUrl(`/customer/buyPolicy/${scheme.schemeId}`);
  }

  viewPolicy(scheme: any): void {
    this.router.navigateByUrl(`/customer/viewPolicy/${scheme.schemeId}`);
  }

  isAssociated(schemeId: number): boolean {
    return this.associatedSchemes[schemeId] || false;
  }
}
