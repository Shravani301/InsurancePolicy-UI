import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  addEmployeeForm = new FormGroup({
    employeeFirstName: new FormControl('', [
      Validators.required,
      ValidateForm.onlyCharactersValidator,
      Validators.minLength(3),
    ]),
    employeeLastName: new FormControl('', [
      Validators.required,
      ValidateForm.onlyCharactersValidator,
    ]),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]),
    salary: new FormControl('', [Validators.required, Validators.min(0.01)]),
    password: new FormControl('', [
      Validators.required,
      ValidateForm.passwordPatternValidator,
    ]),
  });

  constructor(
    private admin: AdminService,
    private location: Location,
    private toastService: ToastService
  ) {}

  addEmployee(): void {
    if (this.addEmployeeForm.valid) {
      this.admin.addEmployee(this.addEmployeeForm.value).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Employee added successfully!');
          this.addEmployeeForm.reset();
          this.location.back();
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast('error', 'Failed to add employee.');
          console.error(error.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFileds(this.addEmployeeForm);
      this.toastService.showToast('warn', 'One or more fields are required');
    }
  }

  onCancel(): void {
    this.addEmployeeForm.reset();
  }

  goBack(): void {
    this.location.back();
  }
}
