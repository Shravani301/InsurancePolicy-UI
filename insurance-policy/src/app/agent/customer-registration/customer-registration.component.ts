import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RegistrationService } from 'src/app/services/registration.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css']
})
export class CustomerRegistrationComponent {
  states = [
    { StateId: '1', StateName: 'Andhra Pradesh' },
    { StateId: '2', StateName: 'Arunachal Pradesh' },
    { StateId: '3', StateName: 'Assam' },
    { StateId: '4', StateName: 'Bihar' },
    { StateId: '5', StateName: 'Chhattisgarh' },
    { StateId: '6', StateName: 'Goa' },
    { StateId: '7', StateName: 'Gujarat' },
    { StateId: '8', StateName: 'Haryana' },
    { StateId: '9', StateName: 'Himachal Pradesh' },
    { StateId: '10', StateName: 'Jharkhand' },
    { StateId: '11', StateName: 'Karnataka' },
    { StateId: '12', StateName: 'Kerala' },
    { StateId: '13', StateName: 'Madhya Pradesh' },
    { StateId: '14', StateName: 'Maharashtra' },
    { StateId: '15', StateName: 'Manipur' },
    { StateId: '16', StateName: 'Meghalaya' },
    { StateId: '17', StateName: 'Mizoram' },
    { StateId: '18', StateName: 'Nagaland' },
    { StateId: '19', StateName: 'Odisha' },
    { StateId: '20', StateName: 'Punjab' },
    { StateId: '21', StateName: 'Rajasthan' },
    { StateId: '22', StateName: 'Sikkim' },
    { StateId: '23', StateName: 'Tamil Nadu' },
    { StateId: '24', StateName: 'Telangana' },
    { StateId: '25', StateName: 'Tripura' },
    { StateId: '26', StateName: 'Uttar Pradesh' },
    { StateId: '27', StateName: 'Uttarakhand' },
    { StateId: '28', StateName: 'West Bengal' },
  ];

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
    state: new FormControl('', Validators.required), // Dropdown value bound here
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
    private toastService: ToastService, // Assuming ToastService is a custom service for displaying snackbar messages
    private router: Router,
    private location: Location
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
    console.log('Form Submitted:', this.registrationForm.valid); // Debug form validity
    console.log('Form Errors:', this.registrationForm.errors); // Debug form errors
    console.log('Form Data:', this.registrationForm.value); // Debug form data

    if (this.registrationForm.valid) {
      // const { confirmPassword, ...formData } = this.registrationForm.value; // Remove confirmPassword
      
      const { confirmPassword, ...formData } = this.registrationForm.value; 
    
    // Fetch agentId from localStorage
    const agentId = localStorage.getItem('id');
    
    // Include agentId in the final data
    
    const dateOfBirth=this.registrationForm.value['dob'];
    const finalData = { ...formData, agentId, status: true,dateOfBirth }; // Add agentId and status
    
    console.log('Submitting data to API:', finalData); // Debug API payload

      console.log('Submitting data to API:', finalData); // Debug API payload

      this.registrationService.registerUser(finalData).subscribe(
        (response) => {
          console.log('API Response:', response); // Debug API response
          this.toastService.showToast("success",'Registration successful!')
          this.router.navigate(['agent-dashboard']);
        },
        (error) => {
          console.error('API Error:', error); // Debug API error
          this.toastService.showToast("error",error.error?.errorMessage||'Registration failed. Please try again.');
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
      console.warn('Form is invalid!'); // Debug invalid form
    }
  }
  goBack(): void {
    this.location.back();
  }

}
