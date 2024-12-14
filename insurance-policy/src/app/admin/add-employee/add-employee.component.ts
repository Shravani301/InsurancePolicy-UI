import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {  
  hidePassword = true;
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
    salary: new FormControl('', [Validators.required, Validators.min(5000)]),
    password: new FormControl('', [
      Validators.required,
      ValidateForm.passwordPatternValidator,
    ]),
  });

  constructor(
    private admin: AdminService,
    private location: Location,
    private toastService: ToastService,
    private router: Router,  // add router for navigation
  ) {}

  addEmployee(): void {
    if (this.addEmployeeForm.valid) {
      this.admin.addEmployee(this.addEmployeeForm.value).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Employee added successfully!');
          this.addEmployeeForm.reset();
          this.router.navigate(['//admin-dashboard']);  // add navigation to employees page after successful add.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.  // add router for navigation.
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast('error', error.error?.errorMessage||'Failed to add employee.');
          console.error(error.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFileds(this.addEmployeeForm);
      this.toastService.showToast('warn', 'complete all the details');
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  onCancel(): void {
    this.addEmployeeForm.reset();
  }

  goBack(): void {
    this.location.back();
  }
}
