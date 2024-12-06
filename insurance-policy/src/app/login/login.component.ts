import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../services/toast.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  myToken: any = '';
  role: any = '';
  captchaText: string = ''; // Captcha text
 
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      captchaInput: ['', Validators.required], // Add form control for CAPTCHA input
    });
 
    this.generateCaptcha(); // Generate CAPTCHA on component load
  }
 
  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
 
  // Generate a new CAPTCHA
  generateCaptcha(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaText = Array.from({ length: 6 })
      .map(() => characters[Math.floor(Math.random() * characters.length)])
      .join('');
  }
 
  // Handle form submission
  onSubmitData(): void {
    const userCaptchaInput = this.loginForm.get('captchaInput')?.value;
 
    // Validate CAPTCHA
    if (userCaptchaInput !== this.captchaText) {
      this.snackBar.open('Invalid CAPTCHA. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.generateCaptcha(); // Regenerate CAPTCHA on failure
      return;
    }
 
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
 
      this.loginService.login(credentials).subscribe(
        (response: any) => {
          this.myToken = response.headers.get('Jwt');
          localStorage.setItem('token', this.myToken);
          this.role = response.body;
          localStorage.setItem('role', this.role.roleName);
        
 
          // Redirect based on roleName
          switch (this.role.roleName) {
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
              this.snackBar.open(
                'Unknown role. Please contact support.',
                'Close',
                { duration: 3000, panelClass: ['error-snackbar'] }
              );
          }
 
          this.toastService.showToast('success', 'Login successful!');
        },
        (error) => {
          console.error('Login error:', error);
          this.toastService.showToast('error', 'Invalid username or password.');
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