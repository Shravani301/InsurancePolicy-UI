import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent {
  customerData: any;
  filteredPolicies: any[]=[];
  searchQuery!: string; // Changed to string for scheme name search
  currentPage = 1;
  totalPolicyCount = 0;  
  totalPages: number = 1;
  policies: any[] = [];
  pageSizes: number[] = [5, 10, 20, 30];
  pageSize = this.pageSizes[0];
  isSwitchOn = true; // Controls whether to show purchased or applied policies
  userId:any='';
  role:any='';
  empId:any='';  
  sortColumn: string = 'insuranceSchemeName';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedPolicyId:string='';
  maxVisiblePages: number = 3; // Maximum number of pages to display

  constructor(private customer: CustomerService, private router: Router, private location: Location,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private employee:EmployeeService
  ) {}

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    if (this.role === 'Employee') {
      const storedId = localStorage.getItem('id');
      console.log("Retrieved ID from localStorage:", storedId);
  
      this.empId = storedId;
  
      if (!this.empId) {
          console.error("User ID not found in localStorage for role 'Customer'.");
          return;
      }
    }
    if (this.role === 'Customer') {
      const storedId = localStorage.getItem('id');
      console.log("Retrieved ID from localStorage:", storedId);
  
      this.userId = storedId;
  
      if (!this.userId) {
          console.error("User ID not found in localStorage for role 'Customer'.");
          return;
      }
    } else if (this.role === 'Admin' || this.role === 'Employee') {
      this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    }
  
    this.getPolicies();
  }
  getPolicies() {    
      // Call getPoliciesPending for applied policies
      this.customer.getPoliciesPendingAll(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.handlePolicyResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.filteredPolicies = [];
        },
      });
    
  }
  
  private handlePolicyResponse(response: any): void {
    const paginationHeader = response.headers.get('X-Pagination');
    this.totalPages = parseInt(response.headers.get('X-Total-Pages') || '1', 10);
  
    if (paginationHeader) {
      const paginationData = JSON.parse(paginationHeader);
      this.totalPolicyCount = paginationData.TotalCount;
    }
  
    this.filteredPolicies = response.body || [];
  }
  
  
  sortPolicies(): void {
    this.filteredPolicies.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
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
    if (page >= 1 && page <= this.totalPages) { // Prevent duplicate API calls
    this.currentPage = page;
    this.getPolicies();
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
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1; // Reset to the first page
    this.getPolicies();
  }

  // toggleSwitch(state: boolean) {
  //   if (this.isSwitchOn === state) return; // Avoid redundant calls
  //   this.isSwitchOn = state;
  //   this.getPolicies();
  // }

  goBack() {
    this.location.back();
  }

  viewPolicy(policy: any) {
    if(this.role==='Employee')
      this.router.navigateByUrl(`employee/Policy/${policy.policyId}/${policy.customerId}`);
    else if(this.role==='Admin')
      this.router.navigateByUrl(`admin/Policy/${policy.policyId}/${policy.customerId}`);
    else
    this.router.navigateByUrl(`customer/Policy/${policy.policyId}`);
  }
Payments(policy:any)
{ 
  this.router.navigateByUrl(`customer/Payments/${policy.policyId}`);
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
  addClaim(policy:any): void {
    //this.router.navigateByUrl(`customer/claimRequest/${policy.policyId}`);
    this.router.navigate(['/customer/claimRequest', policy.policyId]);
  }

  toggleRejectBox(policyId: string = ''): void {
    this.showRejectBox = !this.showRejectBox;
    this.selectedPolicyId = policyId;
  }

  rejectPolicy(): void {
    this.employee.rejectPolicy(this.selectedPolicyId).subscribe({
      next: () => {
        this.getPolicies();
        this.toggleRejectBox(); // Close the box after successful rejection
        this.toastService.showToast('success',"Policy rejected successfully");
      },
      error: () =>{ console.error('Error rejecting document'),
      this.toastService.showToast('error',"Error rejecting Policy'");
      }
    });
  }
  approvePolicy(policyId:any): void {
    this.employee.approvePolicy(policyId).subscribe({
      next: () => {
        this.getPolicies();
        this.toastService.showToast('success',"Policy approved successfully");
      },
      error: () => {
        this.toastService.showToast('error',"error occured please try after sometime!");
        console.error('Error approve document');
      }
    });
  }
 // Reject Box State
 showRejectBox: boolean = false;
 selecteddocId: string = '';

}
