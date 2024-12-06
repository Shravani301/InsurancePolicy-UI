import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-view-employees',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css'],
})
export class ViewEmployeesComponent implements OnInit {
  employees: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalEmployees = 0;
  isLoading = false;
  errorMessage = '';
  newEmployeeData = { firstName: '', lastName: '', phone: '', salary: 0 };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getEmployees(this.currentPage, this.pageSize);
  }

  getEmployees(page: number, size: number): void {
    this.isLoading = true;
    this.adminService.getEmployees(page, size).subscribe({
      next: (response) => {
        this.isLoading = false;
        const paginationHeader = response.headers.get('X-Pagination');
        if (paginationHeader) {
          const paginationData = JSON.parse(paginationHeader);
          this.totalEmployees = paginationData.TotalCount;
        }
        this.employees = response.body || [];
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load employees';
        console.error(err);
      },
    });
  }

  addEmployee(): void {
    if (!this.newEmployeeData.firstName || !this.newEmployeeData.lastName) {
      alert('Please provide valid employee data.');
      return;
    }

    this.adminService.addEmployee(this.newEmployeeData).subscribe({
      next: () => {
        alert('Employee added successfully!');
        this.getEmployees(this.currentPage, this.pageSize);
        this.newEmployeeData = { firstName: '', lastName: '', phone: '', salary: 0 }; // Reset form
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to add employee.');
        console.error(err);
      },
    });
  }

  updateEmployee(employee: any): void {
    this.adminService.updateEmployee(employee).subscribe({
      next: () => {
        alert('Employee updated successfully!');
        this.getEmployees(this.currentPage, this.pageSize);
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to update employee.');
        console.error(err);
      },
    });
  }

  deleteEmployee(employeeId: string): void {
    const confirmation = confirm('Are you sure you want to delete this employee?');
    if (!confirmation) return;

    this.adminService.deleteEmployee(employeeId).subscribe({
      next: () => {
        alert('Employee deleted successfully!');
        this.getEmployees(this.currentPage, this.pageSize);
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to delete employee.');
        console.error(err);
      },
    });
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getEmployees(this.currentPage, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getEmployees(this.currentPage, this.pageSize);
  }

  // Getter for total pages
  get totalPages(): number {
    return Math.ceil(this.totalEmployees / this.pageSize);
  }
}
