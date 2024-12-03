import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmitData(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.loginService.login(credentials).subscribe(
        (response) => {
          console.log('Login successful:', response);

          // Redirect based on roleName
          switch (response.roleName) {
            case 'Admin':
              this.router.navigateByUrl('admin-dashboard');
              break;
            case 'Customer':
              this.router.navigate(['/customer-dashboard']);
              break;
            case 'Agent':
              this.router.navigate(['/agent-dashboard']);
              break;
            case 'Employee':
              this.router.navigate(['/employee-dashboard']);
              break;
            default:
              this.snackBar.open('Unknown role. Please contact support.', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar'],
              });
          }

          // Show success toast
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        (error) => {
          console.error('Login error:', error);

          // Show error toast
          this.snackBar.open('Invalid username or password.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}
