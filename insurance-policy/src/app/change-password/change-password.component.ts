import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  userName: any='';

  jwtHelper = new JwtHelperService();
  isAdmin = false;
  isCustomer = false;
  isAgent = false;
  isEmployee = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {
    this.changePasswordForm = new FormGroup(
      {
        oldPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      
    );
  }

  ngOnInit() {
    const storedName=localStorage.getItem('userName');
    if(!storedName)
      return;
    this.userName=storedName;

    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);
    const role: string =
      decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (role === 'Customer') {
      this.isCustomer = true;
    } else if (role === 'Admin') {
      this.isAdmin = true;
    }
    else if (role === 'Agent') {
      this.isAgent = true;
    }
    else if(role==='Employee')
    {
      this.isEmployee=true;
    }
  }

  updatePassword() {
    if (this.changePasswordForm.invalid) {
      this.toastService.showToast('warn', 'Please complete all the details.');
      return;
    }
     // Add userName to the payload
  const { confirmPassword, ...formData } = this.changePasswordForm.value; // Exclude confirmPassword before submission
    const payload = {
      ...formData,
      userName: this.userName, // Include userName field
    };
    this.auth.changePassword(payload).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Password updated successfully.');
        this.auth.logOut();
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.toastService.showToast('error', err.error?.message||'Something went wrong!');
      },
    });
  }

  
  togglePasswordVisibility(field: string): void {
    if (field === 'old') {
      this.hideOldPassword = !this.hideOldPassword;
    } else if (field === 'new') {
      this.hideNewPassword = !this.hideNewPassword;
    } else if (field === 'confirm') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  goBack() {
    this.location.back();
  }
}
