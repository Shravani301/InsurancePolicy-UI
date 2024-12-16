import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ValidateForm } from 'src/app/helper/validateForm';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-view-policy',
  templateUrl: './view-policy.component.html',
  styleUrls: ['./view-policy.component.css']
})
export class ViewPolicyComponent implements OnInit {
  policyId!: string; // Updated to string type
  policy: any;
  customerId!: string; // To store customer ID from local storage
  customerData: any = [];
  schemeData: any;
  installment: { number: number, isPaid: boolean }[] = [{ number: 1, isPaid: true }];
  schemeDeatil: any = {};
  PaymentForm!: FormGroup;
  ClaimForm!: FormGroup;
  installmentNo!: number;
  minDate: string;
  role: string = ''; // To store user role
empId: string = ''; // To store employee ID
showModal: boolean = false; // For modal visibility
modalImageURL: string | null = null; // For modal image URL

  isClaimFormVisible: boolean = false; // Toggle visibility for claim form

  constructor(
    private activatedroute: ActivatedRoute,
    private location: Location,
    private customer: CustomerService,
    private fb: FormBuilder,
    private employee: EmployeeService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Extract policyId from URL
    this.policyId = this.activatedroute.snapshot.paramMap.get('id') || '';
    console.log('Extracted Policy ID:', this.policyId);
    this.customerId = this.activatedroute.snapshot.paramMap.get('id1') || '';
    this.role = localStorage.getItem('role') || '';
  if (this.role === 'Employee') {
    this.empId = localStorage.getItem('id') || '';
  }
    // Check customer ID in local storage
    if(!this.customerId)
      this.customerId = localStorage.getItem('id') || '';
    if (!this.customerId) {
      console.error('Customer ID is missing in local storage.');
      return;
    }
    console.log('Customer ID:', this.customerId);

    if (!this.policyId) {
      console.error('Invalid or missing Policy ID in URL.');
      return;
    }

    // Fetch data
    this.getPolicyData();
    this.getCustomerDetail();
    this.initializeForms();
  }

  initializeForms(): void {
    this.PaymentForm = this.fb.group({
      payType: ['', [Validators.required]],
      cHolderName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      cNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      DateOfExpiry: ['', [Validators.required]]
    });

    this.ClaimForm = this.fb.group({
      accNo: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      ifsc: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{4}[0][0-9]{6}$/)]]
    });
  }

  viewDocument(doc: any): void {
    this.modalImageURL = doc.documentPath; // Assuming documentPath is the URL
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.modalImageURL = null;
  }
  
  // Fetch policy data using policyId
  getPolicyData(): void {
    console.log('Fetching policy data for Policy ID:', this.policyId);
    this.customer.getPolicy(this.policyId).subscribe({
      next: (res: any) => {
        console.log('Policy data fetched:', res);
        this.policy = res;
      },
      error: (err: HttpErrorResponse) => console.error('Error fetching policy data:', err)
    });
  }
  toggleRejectBox(docId: string = ''): void {
    this.showRejectBox = !this.showRejectBox;
    this.selecteddocId = docId;
  }

  rejectDocument(): void {
    this.employee.rejectDocument(this.selecteddocId,this.empId).subscribe({
      next: () => {
        this.getPolicyData();
        this.toggleRejectBox(); // Close the box after successful rejection
      },
      error: () => console.error('Error rejecting document'),
    });
  }
  approveDocument(documentId:any): void {
    this.employee.approveDocument(documentId,this.empId).subscribe({
      next: () => {
        this.getPolicyData();
        console.log('approved document')
      },
      error: () => console.error('Error approve document'),
    });
  }
 // Reject Box State
 showRejectBox: boolean = false;
 selecteddocId: string = '';



  // Fetch customer profile using customerId
  getCustomerDetail(): void {
    console.log('Fetching customer profile for Customer ID:', this.customerId);
    this.customer.getCustomerProfile(this.customerId).subscribe({
      next: (res) => {
        console.log('Customer profile fetched:', res);
        this.customerData = res.body;
      },
      error: (err: HttpErrorResponse) => console.error('Error fetching customer profile:', err)
    });
  }

  resetPaymentForm(): void {
    this.PaymentForm.reset();
  }

  resetClaimForm(): void {
    this.ClaimForm.reset();
    this.isClaimFormVisible = false; // Hide the form
  }

  
  getSchemeData(): void {
    console.log('Fetching scheme data for scheme ID:', this.policy.insuranceSchemeId);
    this.customer.getSchemeById(this.policy.insuranceSchemeId).subscribe({
      next: (res) => {
        console.log('Scheme data fetched:', res);
        this.schemeData = res;
        this.getSchemeDetail();
      },
      error: (err: HttpErrorResponse) => console.error('Error fetching scheme data:', err)
    });
  }

  getSchemeDetail(): void {
    console.log('Fetching scheme details for ID:', this.schemeData.schemeId);
    this.customer.getDetail(this.schemeData.schemeId).subscribe({
      next: (res) => {
        console.log('Scheme details fetched:', res);
        this.schemeDeatil = res;
      },
      error: (err) => console.error('Error fetching scheme details:', err)
    });
  }

  // getTax(): void {
  //   console.log('Fetching tax percentage');
  //   this.customer.getTaxPercent().subscribe({
  //     next: (res) => {
  //       console.log('Tax percentage fetched:', res);
  //       this.Tax = res;
  //     },
  //     error: (err: HttpErrorResponse) => console.error('Error fetching tax percentage:', err.message)
  //   });
  // }

  // calculateTotalAmoutToPay(): number {
  //   return ((this.policy.premium * this.Tax.taxPercent) / 100) + this.policy.premium;
  // }

  calculateDueDate(emi: number): Date {
    const parsedIssueDate = new Date(this.policy.issueDate);
    const dueDate = new Date(parsedIssueDate);

    const emiMode = this.policy.premiumMode;
    if (emiMode === 3) {
      dueDate.setMonth(dueDate.getMonth() + (1 * emi));
    } else if (emiMode === 2) {
      dueDate.setMonth(dueDate.getMonth() + (3 * emi));
    } else if (emiMode === 1) {
      dueDate.setMonth(dueDate.getMonth() + (6 * emi));
    } else {
      dueDate.setMonth(dueDate.getMonth() + (12 * emi));
    }

    return dueDate;
  }

  showPaymentModal(index: number): void {
    this.router.navigateByUrl('customer/policy/pay/' + this.policyId);
  }

  downloadReceipt(index: number): void {
    this.router.navigateByUrl('/payment/receipt/' + this.policy.payments[index].paymentId);
  }

  showClaimForm(): void {
    this.isClaimFormVisible = true; // Show the claim form
  }

  claimPolicy(): void {
    if (this.ClaimForm.valid) {
      const claim = {
        bankAccountNo: this.ClaimForm.get('accNo')?.value,
        bankIFSCCode: this.ClaimForm.get('ifsc')?.value,
        claimAmount: this.policy.sumAssured,
        policyNumber: this.policy.policyNo
      };

      console.log('Submitting claim:', claim);
      this.customer.registerCliam(claim).subscribe({
        next: () => {
          alert('Claim added successfully');
          this.resetClaimForm();
          location.reload();
        },
        error: (err: HttpErrorResponse) => alert('Something went wrong')
      });
    } else {
      alert('One or more fields are required.');
      ValidateForm.validateAllFormFileds(this.ClaimForm);
    }
  }
  

  goBack(): void {
    this.location.back();
  }
}
