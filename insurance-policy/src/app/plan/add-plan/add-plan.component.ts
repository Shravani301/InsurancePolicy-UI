import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service'; // Import ToastService
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent {

  constructor(private admin: AdminService, private location: Location, private toastService: ToastService,private router:Router) {}

  addPlanForm = new FormGroup({
    planName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
  });

  addPlan(): void {
    if (this.addPlanForm.valid) {
      console.log(this.addPlanForm.value);
      this.admin.addPlan(this.addPlanForm.value).subscribe({
        next: (data: any) => {
          console.log(data);
          this.addPlanForm.reset();
          this.toastService.showToast('success', 'Plan registered successfully.');
          this.router.navigate(['admin/viewPlan']);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.toastService.showToast('error', error.error?.errorMessage || 'Failed to add plan.');
          this.addPlanForm.reset();
        },
      });
    } else {
      this.validateAllFormFields(this.addPlanForm); // Validate form fields
      this.toastService.showToast('error', 'Plan name is required!.');
    }
  }

  OnCancel() {
    this.addPlanForm.reset();
  }

  goBack() {
    this.location.back();
  }

  // Utility method to validate all form fields
  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
