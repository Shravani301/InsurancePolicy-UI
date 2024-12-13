import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaints.component.html',
  styleUrls: ['./view-complaints.component.css'],
})
export class ViewComplaintsComponent implements OnInit {
  isEmployee = false;
  isAdmin = false;
  isSearch = false;
  currentPage = 1;
  totalComplaintCount = 0;
  queries: any[] = [];
  filteredCommissions: any[] = [];
  pageSizes: number[] = [5, 10, 15, 20, 25];
  pageSize = this.pageSizes[0];
  complaintResponseForm!: FormGroup;
  replyModal: any;
  searchQuery: string = '';
  filteredQueries: any[] = [];
  selectedQuery: any = null; // Store the selected query
  responseText: string = ''; // Store the response text
  employeeId:any='';
  role:any='';
  private jwtHelper = new JwtHelperService();

  constructor(
    private employeeService: EmployeeService,
    private location: Location,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.initializeForm();
    this.getAllQueries();
    this.employeeId=localStorage.getItem('id');
    this.role=localStorage.getItem('role');
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


onSearch(): void {
  if (this.searchQuery.trim()) {
    this.isSearch = true;
    this.filteredQueries = this.queries.filter((query) =>
      query.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    
  );
  this.queries=this.filteredQueries;
    this.isSearch = true;
  } else {
    this.resetSearch();
  }
}

resetSearch(): void {
  this.searchQuery = '';
  this.isSearch = false;
  this.filteredQueries = [...this.queries]; // Reset filtered data to original customer data
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
    this.selectedQuery = query; // Set the selected query
    this.responseText = ''; // Clear the previous response

    const modalElement = document.getElementById('replyModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
    }
    
  }

  // Close the reply modal
  closeModal(): void {
    const modalElement = document.getElementById('replyModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  // Submit the response
  submitResponse(): void {
    if (!this.responseText || this.responseText.trim() === '') {
      alert('Response cannot be empty!');
      return;
    }
  
    if (this.selectedQuery) {
      const employeeId = localStorage.getItem('id'); // Retrieve employeeId from localStorage
  
      if (!employeeId) {
        this.toastService.showToast("error",'Employee ID is missing. Please log in again.');
        return;
      }
  
      const queryId = this.selectedQuery.queryId; // Get the queryId
      const response = this.responseText.trim(); // Trim response text
  
      // Call the service to resolve the query
      console.log(queryId);
      this.employeeService.resolveQuery(queryId, response, employeeId).subscribe({
        next: () => {
          this.toastService.showToast("success",'Response submitted successfully!');
          this.selectedQuery.response = response; // Update the query response locally
          this.responseText = ''; // Clear the response text
          this.closeModal(); // Close the modal
          this.getAllQueries(); // Refresh the queries list
        },
        error: (err) => {
          console.error('Error submitting response:', err);
          this.toastService.showToast("error",'Failed to submit response. Please try again later.');
        }
      });
    }
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
            this.toastService.showToast("success",'Complaint updated successfully!');
            this.getAllQueries();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating complaint:', err);
           this.toastService.showToast("error",'Failed to update complaint. Please try again.');
          },
        });
      }
    } else {
      this.toastService.showToast("error",'Please fill out the response before submitting.');
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
