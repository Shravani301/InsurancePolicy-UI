import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaints.component.html',
  styleUrls: ['./view-complaints.component.css'],
})
export class ViewComplaintsComponent implements OnInit {
  isEmployee = false;
  isAdmin = false;
  isSearch = false;
  searchQuery: string | undefined;
  currentPage = 1;
  totalComplaintCount = 0;
  queries: any[] = [];
  filteredCommissions: any[] = [];
  pageSizes: number[] = [5, 10, 15, 20, 25];
  pageSize = this.pageSizes[0];
  complaintResponseForm!: FormGroup;
  replyModal: any;

  private jwtHelper = new JwtHelperService();

  constructor(
    private employeeService: EmployeeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.initializeForm();
    this.getAllQueries();
  }

  // Check user role from JWT
  checkUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const role: string =
        decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (role === 'Admin') {
        this.isAdmin = true;
      } else if (role === 'Employee') {
        this.isEmployee = true;
      }
    }
  }

  // Initialize the complaint response form
  initializeForm(): void {
    this.complaintResponseForm = new FormGroup({
      response: new FormControl('', [Validators.required]),
    });
  }

  // Fetch all queries with pagination and search
  getAllQueries(): void {
    this.employeeService
        .getCustomerQueries(this.currentPage, this.pageSize, this.searchQuery)
        .subscribe({
            next: (response: any) => {
                const paginationHeader = response.headers.get('X-Pagination');
                if (paginationHeader) {
                    const paginationData = JSON.parse(paginationHeader);
                    this.totalComplaintCount = paginationData.TotalCount;
                }
                this.queries = response.body;
                this.filteredCommissions = [...this.queries]; // Copy queries to filteredCommissions
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error fetching complaints:', err);
                this.queries = [];
                this.filteredCommissions = [];
            },
        });
}


  // Handle search functionality
  onSearch(): void {
    this.isSearch = true;
    this.getAllQueries();
  }

  // Reset search filters
  resetSearch(): void {
    this.searchQuery = undefined;
    this.isSearch = false;
    this.getAllQueries();
  }

  // Change the current page
  changePage(page: number): void {
    this.currentPage = page;
    this.getAllQueries();
  }

  // Handle page size change
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllQueries();
  }

  // Calculate serial number
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  // Open reply modal with selected query
  onReply(query: any): void {
    this.replyModal.show();
    this.complaintResponseForm.patchValue({ response: query.response || '' });
  }

  // Update the selected complaint with a response
  updateComplaint(): void {
    if (this.complaintResponseForm.valid) {
      const updatedResponse = this.complaintResponseForm.value.response;
      const selectedQuery = this.queries.find(
        (query) => query.response === updatedResponse
      );

      if (selectedQuery) {
        selectedQuery.response = updatedResponse;
        // Perform API call to update response
        this.employeeService.updateComplaint(selectedQuery).subscribe({
          next: () => {
            alert('Complaint updated successfully!');
            this.getAllQueries();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating complaint:', err);
            alert('Failed to update complaint. Please try again.');
          },
        });
      }
    } else {
      alert('Please fill out the response before submitting.');
    }
  }

  // Pagination helper for generating page numbers
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  // Calculate total page count
  get pageCount(): number {
    return Math.ceil(this.totalComplaintCount / this.pageSize);
  }

  // Go back to the previous location
  goBack(): void {
    this.location.back();
  }
}
