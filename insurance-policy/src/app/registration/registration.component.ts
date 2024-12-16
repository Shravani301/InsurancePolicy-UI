import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    customerFirstName: new FormControl('', Validators.required),
    customerLastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    dob: new FormControl('', [Validators.required, this.ageValidator]), // DOB with age validation
    houseNo: new FormControl('', Validators.required),
    apartment: new FormControl('', Validators.required),
    pincode: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]{5}$'),
    ]),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*\\.\\-_])[A-Za-z\\d!@#\\$%\\^&\\*\\.\\-_]{8,}$'
      ),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private registrationService: RegistrationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // Custom validator to check age >= 18
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      // If no value is provided, do not return an error
      return null;
    }
  
    const dob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();
  
    // Adjust age if the birthday hasn't been reached this year
    const adjustedAge =
      age - (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0) ? 1 : 0);
  
    return adjustedAge >= 18 ? null : { underAge: true };
  }
  

  onSubmitData(): void {
    if (this.registrationForm.valid) {
      // Exclude 'dob' field from the form data
      const { dob, confirmPassword, ...formData } = this.registrationForm.value; 
      const finalData = { ...formData, status: true }; // Add status field
      
      console.log('Submitting data to API:', finalData); // Debug API payload

      this.registrationService.registerUser(finalData).subscribe(
        (response) => {
          console.log('API Response:', response);
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['']);
        },
        (error) => {
          console.error('API Error:', error);
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
      console.warn('Form is invalid!');
    }
  }
}
