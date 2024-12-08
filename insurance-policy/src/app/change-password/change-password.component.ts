import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8), // Minimum length of 8
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // At least one uppercase letter, one number, and one special character
    ])
  });
  hidePassword = true;
  
  jwtHelper = new JwtHelperService();
  isAdmin = false;
  isCustomer = false;
  isAgent = false;
  isEmployee = false;

  constructor(private auth: AuthService, private router: Router, 
    private location: Location,private toastService:ToastService) {}

  ngOnInit() {
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);
    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'Customer') {
      this.isCustomer = true;
    } else if (role === 'Admin') {
      this.isAdmin = true;
    } else if (role === 'Agent') {
      this.isAgent = true;
    } else {
      this.isEmployee = true;
    }
  }

  updatePassword() {
    const userName = this.changePasswordForm.get('userName')?.value;
    const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
    const newPassword = this.changePasswordForm.get('newPassword')?.value;

    // Explicit validation
    if (!userName) {
      alert("User Name is required");
      return;
    }
    if (!oldPassword) {
      alert("Old Password is required");
      return;
    }
    if (!newPassword) {
      this.toastService.showToast("warn", "New Password is required");
      return;
    }
    if (newPassword.length < 8) {
      this.toastService.showToast("warn", "New Password must be at least 8 characters long");
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      alert("New Password must contain at least one uppercase letter, one number, and one special character");
      return;
    }

    
    // Proceed with password update
    this.auth.changePassword(this.changePasswordForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.toastService.showToast("success", "Updated Successfully");
        this.auth.logOut();
        this.toastService.showToast("info", "You are logged out, please log in again");
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        alert("Something went wrong!");
      }
    });
  }

  goBack() {
    this.location.back();
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
 
}
