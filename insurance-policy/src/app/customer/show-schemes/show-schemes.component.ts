import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { forkJoin, map } from 'rxjs'; // Import forkJoin and map
import { ToastService } from 'src/app/services/toast.service';

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
  customerId: any = localStorage.getItem('id');
  associatedSchemes: Record<number, boolean> = {}; // Store association status per scheme
role:any='';
  constructor(
    private admin: AdminService,
    private customerService: CustomerService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.role = localStorage.getItem('role') || 'Customer';
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
    this.customerService
      .isCustomerAssociatedWithScheme(scheme.schemeId, this.customerId)
      .subscribe({
        next: (response) => {
          if (!response.body.isAssociated) {
            // Redirect only if the customer is associated with the scheme
            this.router.navigateByUrl(`/customer/buyPolicy/${scheme.schemeId}`);
          } else {
            console.error('Customer is associated (purchased) with this scheme.');
            // You can also show a toast or alert here
            this.toastService.showToast("error",'You are associated with this scheme and cannot re-purchase this policy.');
          }
        },
        error: (err) => {
          console.error('Error checking scheme association:', err);
          alert('Unable to verify association with the scheme. Please try again later.');
        }
      });
  }

  viewPolicy(scheme: any): void {
    this.router.navigateByUrl(`/customer/viewPolicy/${scheme.schemeId}`);
  }

  isAssociated(schemeId: number): boolean {
    return this.associatedSchemes[schemeId] || false;
  }
  registerPolicy(scheme: any): void {
    this.router.navigateByUrl(`/agent/registerPolicy/${scheme.schemeId}`);
    console.log('Registering policy:', scheme);
    // Implement the logic for registering a policy
  }
}
