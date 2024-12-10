import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-claim-request',
  templateUrl: './claim-request.component.html',
  styleUrls: ['./claim-request.component.css']
})
export class ClaimRequestComponent {
  addComplaintForm!: FormGroup; // Use ! to indicate that this will be initialized later
  customerProfile: any;
  policyId: string='';

  constructor(
    private customer: CustomerService,
    private location: Location,
    private toastService: ToastService,
    private activatedRoute:ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.policyId = idParam;
    } else {
      console.error('Missing policyId in route parameters');
      this.router.navigate(['/error']);
    }
  
    this.addComplaintForm = new FormGroup({
      claimAmount: new FormControl(0.01, [Validators.required, Validators.min(0.01)]),
      bankAccountNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{9,18}$/), // Validates 9 to 18 digit numbers
      ]),
      bankIFSCCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/), // Validates IFSC code
      ]),
      claimReason: new FormControl(''), // Optional field
    });
  
    
  }
  

  goBack(): void {
    this.location.back();
  }


  addClaimRequest(): void {
    if (this.addComplaintForm.valid) {
      const customerId = localStorage.getItem('id');
      if (!customerId) {
        this.toastService.showToast('error', 'Customer ID is missing. Please log in again.');
        return;
      }
  
      const claimRequest = {
        policyId: this.policyId,
        customerId: customerId,
        claimAmount: this.addComplaintForm.get('claimAmount')!.value,
        bankAccountNumber: this.addComplaintForm.get('bankAccountNumber')!.value,
        bankIFSCCode: this.addComplaintForm.get('bankIFSCCode')!.value,
        claimDate: new Date().toISOString(), // Set current timestamp
        claimReason: this.addComplaintForm.get('claimReason')!.value, // Optional field
      };
  
      console.log('Claim Request Payload:', claimRequest);
  
      this.customer.addClaim(claimRequest).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Claim request submitted successfully!');
          this.addComplaintForm.reset();
          this.location.back();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error submitting claim request:', err);
          this.toastService.showToast('error', 'Failed to submit claim request.');
        },
      });
    } else {
      this.validateAllFormFields(this.addComplaintForm);
      this.toastService.showToast('error', 'Please fill out all required fields.');
    }
  }
  
  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  onlyCharactersValidator(control: FormControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z ]+$/.test(control.value);
    return valid ? null : { onlyCharacters: { message: 'Only alphabetic characters are allowed.' } };
  }
}
