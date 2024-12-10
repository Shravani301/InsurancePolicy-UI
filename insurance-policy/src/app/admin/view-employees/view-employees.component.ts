import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-view-emp',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css']
})
export class ViewEmployeesComponent implements OnInit {
  isError = false;
  isSearch = false;
  currentPage = 1;
  totalEmployeeCount = 0;
  totalPages = 0;
  hasNext = false;
  hasPrev = false;
  sortColumn: string = 'employeeFirstName';
  employees: any[] = [];
  pageSizes: number[] = [5, 10, 15, 20, 25];
  pageSize = this.pageSizes[0];
  searchQuery: string = '';
  filteredEmployees: any[] = [];
  updateEmpForm!: FormGroup;

  showInactivateModal = false;
  selectedAgent: any = null;

  constructor(private admin: AdminService, private router: Router, private location: Location,private toastService:ToastService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.initializeForm();
  }

  initializeForm(): void {
    this.updateEmpForm = new FormGroup({
      salary: new FormControl('', [Validators.min(0), Validators.required])
    });
  }

  goBack(): void {
    this.location.back();
  }

  getEmployees(): void {
    this.admin.getEmployees(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const headers = {
          currentPage: parseInt(response.headers.get('X-Current-Page') || '1', 10),
          hasNext: response.headers.get('X-Has-Next') === 'true',
          hasPrevious: response.headers.get('X-Has-Previous') === 'true',
          totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
          totalCount: parseInt(response.headers.get('X-Total-Count') || '0', 10),
        };

        // Set pagination properties
        this.currentPage = headers.currentPage;
        this.hasNext = headers.hasNext;
        this.hasPrev = headers.hasPrevious;
        this.totalPages = headers.totalPages;
        this.totalEmployeeCount = headers.totalCount;

        // Log raw response for debugging
        console.log('API Response:', response);
  
        // Check if pagination header exists
        const paginationHeader = response.headers.get('X-Pagination');
        if (paginationHeader) {
          console.log('Pagination Header:', paginationHeader);
          const paginationData = JSON.parse(paginationHeader);
  
  
          console.log('Parsed Pagination Data:', {
            TotalCount: this.totalEmployeeCount,
            TotalPages: this.totalPages,
            HasNext: this.hasNext,
            HasPrev: this.hasPrev,
          });
        } else {
          console.warn('Pagination header is missing.');
        }
  
        // Update employee data
        this.employees = response.body || [];
        this.filteredEmployees = [...this.employees];
  
        console.log('Employees:', this.employees);
      },
      error: (error) => {
        console.error('Failed to fetch employees:', error);
        this.employees = [];
        this.filteredEmployees = [];
      },
    });
  }
  

  sortEmployees(): void {
    if (this.sortColumn) {
      this.filteredEmployees.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];
  
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          // String comparison (case-insensitive)
          return valueA.localeCompare(valueB);
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
          // Number comparison
          return valueA - valueB;
        } else {
          return 0; // Default if types are mismatched or unknown
        }
      });
    }
  }
  

  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getEmployees(); // Fetch data for the new page
    }
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getEmployees();
  }

  onEdit(emp: any): void {
    this.employees.forEach((e) => (e.isEdit = false));
    emp.isEdit = true;
  }

  onUpdate(emp: any): void {
    if (this.updateEmpForm.valid) {
      const id = emp.employeeId; // Get the employee ID directly
      console.log(id);  
      const salary = this.updateEmpForm.get('salary')?.value; // Get the updated salary from the form
      console.log(salary);  // Debugging purposes
      if (id && salary) {
        this.admin.updateEmployeeSalary(id, salary).subscribe({
          next: () => {
            this.toastService.showToast("success", 'Employee updated successfully!');
            this.getEmployees(); // Refresh the employee list
            emp.isEdit = false; // Exit edit mode
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.toastService.showToast("error", 'Failed to update employee');
          },
        });
      } else {
        if (!id) {
          console.error('Invalid or missing ID:', emp);
        }
        this.toastService.showToast("error", "Invalid ID or Salary.");
      }
    } else {
      this.isError = true; // Show an error if the form is invalid
    }
  }
  
  

  onCancel(emp: any): void {
    emp.isEdit = false;
  }

  toggleStatus(emp: any): void {
    if (emp.status) {
      this.selectedAgent = emp;
      this.showInactivateModal = true;
    } else {
      this.activateEmployee(emp);
    }
  }

  activateEmployee(agent: any): void {
    this.admin.activateEmployee(agent.employeeId).subscribe({
      next: () => {
        this.toastService.showToast("success",'Employee activated successfully!');
        this.getEmployees();
      },
      error: () => {
        console.error('Error activating employee');
      }
    });
  }

  inactivateAgent(): void {
    if (this.selectedAgent) {
      this.admin.inactivateEmployee(this.selectedAgent.employeeId).subscribe({
        next: () => {
          this.toastService.showToast("success",'Employee deactivated successfully!');
          this.closeModal(); // Close the modal
          this.getEmployees(); // Refresh the employee list
        },
        error: (error) => {
          console.error('Error deactivating employee:', error);
          this.toastService.showToast("success",'Failed to deactivate the employee.');
        },
      });
    }
  }
  

  closeModal(): void {
    this.showInactivateModal = false;
    this.selectedAgent = null;
  }

  addEmployee(): void {
    this.router.navigate(['/admin/addEmployee']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const searchLower = this.searchQuery.toLowerCase();
      console.log('Search Query:', searchLower); // Debug search query
  
      this.filteredEmployees = this.employees.filter((emp) => {
        console.log('Checking:', emp); // Debug each employee
        return (
          emp.employeeFirstName?.toLowerCase().includes(searchLower) ||
          emp.employeeLastName?.toLowerCase().includes(searchLower)
        );
      });
  
      this.isSearch = true; // Mark search as active
    } else {
      this.resetSearch(); // Reset search if query is empty
    }
  }
  
  

  resetSearch(): void {
    this.searchQuery = '';
    this.filteredEmployees = [...this.employees];
    this.isSearch = false;
  }
}
