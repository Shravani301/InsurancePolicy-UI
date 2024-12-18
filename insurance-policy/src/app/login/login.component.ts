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
  captchaImage: string = '';
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
 
      const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
 
    if (context) {
      canvas.width = 150; // Adjust width as needed
      canvas.height = 40; // Adjust height as needed
 
      // Background color
      context.fillStyle = '#f2f2f2';
      context.fillRect(0, 0, canvas.width, canvas.height);
 
      // Add noise (optional)
      for (let i = 0; i < 50; i++) {
        context.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        context.beginPath();
        context.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 3,
          0,
          Math.PI * 2
        );
        context.fill();
      }
 
      // CAPTCHA text
      context.font = '30px Arial';
      context.fillStyle = '#333';
      context.textAlign = 'center';
      context.setTransform(1, 0.1 * (Math.random() - 0.5), 0.1 * (Math.random() - 0.5), 1, 0, 0);
      context.fillText(this.captchaText, canvas.width / 2, canvas.height / 1.5);
 
      // Convert canvas to base64 image
      this.captchaImage = canvas.toDataURL('image/png');
    }
  }
  // Handle form submission
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
        localStorage.setItem("userName", this.loginForm.get('userName')?.value!);
        this.role = response.body;
        localStorage.setItem('role', this.role.roleName);

        // If role is Customer, store ID as well
        if (this.role.roleName === 'Customer') {
          localStorage.setItem('id', this.role.customerId); // Assuming `id` is the property for the user ID
        }else if (this.role.roleName === 'Agent') {
          localStorage.setItem('id', this.role.agentId); // Assuming `id` is the property for the user ID
        }else if (this.role.roleName === 'Employee') {
          localStorage.setItem('id', this.role.employeeId); // Assuming `id` is the property for the user ID
        }

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
        this.toastService.showToast('error', 'Invalid username or password or user is inactive.');
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