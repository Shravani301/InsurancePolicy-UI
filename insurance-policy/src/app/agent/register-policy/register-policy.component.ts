import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { DomSanitizer } from '@angular/platform-browser'; // Import DomSanitizer
import { ToastService } from 'src/app/services/toast.service';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-register-policy',
  templateUrl: './register-policy.component.html',
  styleUrls: ['./register-policy.component.css']
})
export class RegisterPolicyComponent implements OnInit {
  customerDetail: any = {};
  filteredCustomers: any[] = []; // Filtered list for search
  customerName: string = '';
  policy: any = {};
  agentName: string = '';
  NomineeForm!: FormGroup;
  schemeData: any = { schemeName: '', minInvestmentTime: 0, maxInvestmentTime: 0, profitRatio: 10 };
  premiumTypes: string[] = ['SINGLE', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY'];
  policyTerms: number[] = [];
  premiumAmounts: number[] =[];
  selectedFile: File | null = null; // Add this property to store the selected file
  documents: any[] = [];
  mappedRequiredDocuments: string[] = [];
  showUploadModal: boolean = false;
  uploadDocumentName: string = '';
  selectedDocuments: any[] = [];
  selectedDocumentIds:string[] = [];
  uploadedDocuments: { [key: string]: string } = {}; // Map to store uploaded document URLs by document name
  showViewModal: boolean = false; // To control the visibility of the view modal
  selectedDocumentUrl: string = ''; // URL of the document to display in the modal
  modalImageURL: string = ''; // To store the URL for the modal
  showModal: boolean = false; // To control the modal visibility
  searchQuery: string = ''; // Search input query
  agentId:any='';


  relationships: string[] = [
    'SPOUSE',
    'CHILD',
    'PARENT',
    'SIBLING',
    'GRANDPARENT',
    'GRANDCHILD',
    'UNCLE',
    'AUNT',
    'NEPHEW',
    'NIECE',
    'COUSIN',
    'OTHER',
  ];
  agents: any[] = [];
  fixedInsuranceSettingId: string = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  fixedTaxId: string = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  schemeId: string = '';
  selectedCustomer: any = null; // To store the selected customer from the modal
  showCustomerSelectionModal: boolean = true; // Control modal visibility
  customers: any[] = []; // List of customers fetched from the API
  constructor(
    private customer: CustomerService,
    private agent: AgentService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Extract schemeId from the URL
    this.route.paramMap.subscribe((params) => {
      this.schemeId = params.get('id') || '';
      this.agentId=localStorage.getItem('id');
    });
    this.policy = {
      customerId: localStorage.getItem('id'),
      insuranceSchemeId: this.schemeId,
      insuranceSettingId: this.fixedInsuranceSettingId,
      taxId: this.fixedTaxId,
      premiumType: '',
      premiumAmount: null,
      policyTerm: null,
      maturityDate: null,
      sumAssured: null,
      nominees: [],
      agentId: null,
    };

    this.getSchemeDetail();
    this.getCustomerProfile();
    this.getDocuments();
    this.initializeNomineeForm();

  }

  initializeNomineeForm() {
    this.NomineeForm = new FormGroup({
      nomineeName: new FormControl('', [Validators.required, ValidateForm.onlyCharactersValidator]),
      relation: new FormControl('', [Validators.required]),
    });
  }

  getSchemeDetail() {
    this.customer.getSchemeById(this.policy.insuranceSchemeId).subscribe({
      next: (res: any) => {
        this.schemeData = res;
        console.log(this.schemeData.minInvestTime);
        console.log(this.schemeData.maxInvestTime);
        this.policy.sumAssured=this.schemeData.profitRatio;
        this.mapRequiredDocuments();
        this.setupPolicyTerms();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching scheme details:', err);
      },
    });
  }

  setupPolicyTerms() {
    const { minInvestmentTime, maxInvestmentTime } = this.schemeData;
  
    if (this.schemeData.minInvestTime == null || this.schemeData.maxInvestTime == null) {
      
      return;
    }
    this.policyTerms = [];
    for (let months = this.schemeData.minInvestTime; months <= this.schemeData.maxInvestTime; months += 12) {
      this.policyTerms.push(months);
    }
  }
  getSanitizedUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDocumentUrl);
  }

  
  validatePremiumAmount() {
    if (
      this.policy.premiumAmount < this.schemeData.minAmount ||
      this.policy.premiumAmount > this.schemeData.maxAmount
    ) {
      this.toastService.showToast("warn",`Investment amount must be between ${this.schemeData.minAmount} and ${this.schemeData.maxAmount}.`
      );
      this.policy.premiumAmount = null; // Reset to null if invalid
    }
  }
  
  
  getCustomerProfile() {
    const agentId = localStorage.getItem('id');
    if (!agentId) {
      return;
    }

    this.agent.getCustomerProfilesByAgentId(agentId).subscribe({
      next: (response: any) => {
        this.customers = response.body || [];
        this.filteredCustomers = [...this.customers]; // Initialize filtered list
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching customers:', err);
        this.toastService.showToast("error",'Failed to fetch customers.');
      },
    });
  }

  // Filter customers based on search query
  filterCustomers() {
    const lowerQuery = this.searchQuery.toLowerCase();
    this.filteredCustomers = this.customers.filter((customer) =>
      customer.customerFirstName.toLowerCase().includes(lowerQuery) ||
      customer.customerLastName.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery)
    );
  }
// Select customer in the modal
selectCustomer(customer: any) {
  this.selectedCustomer = customer;
}

// Confirm customer selection and pass details
confirmCustomerSelection() {
  if (this.selectedCustomer) {
    this.customerDetail = this.selectedCustomer;
    this.showCustomerSelectionModal = false; // Close the modal
    console.log('Selected customer details:', this.customerDetail);
  } else {
    this.toastService.showToast("warn",'Please select a customer.');
  }
}

// Close the modal without selection
closeCustomerSelectionModal() {
  this.showCustomerSelectionModal = false; // Close the modal
   this.goBack();
  // You can redirect back if needed or keep the modal open
}
 
  validatePolicyTerm() {
    if (this.policy.policyTerm < this.schemeData.minInvestTime) {
      this.toastService.showToast("warn",
        `Policy Term cannot be less than ${this.schemeData.minInvestTime} months.`
      );
      this.policy.policyTerm = this.schemeData.minInvestTime;
    } else if (this.policy.policyTerm > this.schemeData.maxInvestTime) {
      this.toastService.showToast("warn",
        `Policy Term cannot exceed ${this.schemeData.maxInvestTime} months.`
      );
      this.policy.policyTerm = this.schemeData.maxInvestTime;
    }
  
    this.onPremiumTypeChange(); // Recalculate based on new value
  }
  onPremiumTypeChange() {
    const baseAmount = Number(this.policy.premiumAmount) || 0;
    const tax = baseAmount * 0.18; // Assuming 18% tax
    const profitRatio = this.schemeData.profitRatio || 10;
  
    this.policy.sumAssured = this.schemeData.profitRatio;
    this.policy.installmentAmount = baseAmount + tax;
  
    // Calculate Maturity Date based on policy term in months
    const policyTermMonths = this.policy.policyTerm || 0; // Policy term in months
    const currentDate = new Date(); // Get the current date
    const maturityDate = new Date(currentDate.getTime()); // Clone the current date
  
    const addedYears = Math.floor(policyTermMonths / 12); // Full years from months
    const remainingMonths = policyTermMonths % 12; // Remaining months after years
  
    maturityDate.setFullYear(maturityDate.getFullYear() + addedYears); // Add years
    maturityDate.setMonth(maturityDate.getMonth() + remainingMonths); // Add months
  
    this.policy.maturityDate = maturityDate; // Update the maturity date in the policy
  }
  policyTermFormControl = new FormControl('', [
    Validators.required,
    Validators.min(this.schemeData.minInvestTime),
    Validators.max(this.schemeData.maxInvestTime),
  ]);
  addPolicy() {
    const policyPayload = {
      insuranceSchemeId: this.policy.insuranceSchemeId,
      customerId: this.selectedCustomer.customerId,
      maturityDate: this.policy.maturityDate?.toISOString(), // Convert Date to ISO string
      premiumType: this.policy.premiumType,
      policyTerm: this.policy.policyTerm,
      premiumAmount: this.policy.premiumAmount,
      agentId:localStorage.getItem('id'),
      taxId: 'ba1830ae-4cb1-ef11-ac89-9d80da5fbf90', // Fixed taxId
      insuranceSettingId: 'e416bd97-4cb1-ef11-ac89-9d80da5fbf90', // Fixed insuranceSettingId
      nominees: this.policy.nominees.map((nominee: any) => ({
        nomineeName: nominee.name,
        relationship: this.relationships.indexOf(nominee.relation), // Get index of relationship
      })),
      selectedDocumentIds: this.selectedDocumentIds, // Directly use the populated array
    };
  
    console.log('Policy payload before submission:', policyPayload); // Debug the payload
  
    this.customer.purchasePolicy(policyPayload).subscribe({
      next: () => {
        this.toastService.showToast("success", 'Policy Applied Successfully');
        this.goBack();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error applying policy:', err);
        this.toastService.showToast("warn", 'Something went wrong!');
      },
    });
  }

  goBack() {
    this.location.back();
  }
  addNominee() {
    this.policy.nominees.push({ name: '', relation: '' });
  }

  removeNominee(index: number) {
    this.policy.nominees.splice(index, 1);
  }
  openSections: { [key: string]: boolean } = {
    customerDetails: true,
    schemeDetails: true,
    policyDetails: true,
    agents: true,
    documents: true,
    nominee: true,
  };
  
  toggleSection(section: string) {
    this.openSections[section] = !this.openSections[section];
  }  
  getDocuments() {
    const customerId = localStorage.getItem('id') || '';
    const role = localStorage.getItem('role') || 'Customer';

    this.customer.getDocuments(customerId, role).subscribe(
      (documents) => {
        this.documents = documents;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }
  docTypes: string[] = [
    'AADHAAR_CARD',
    'PAN_CARD',
    'PASSPORT',
    'DRIVING_LICENSE',
    'VOTER_ID',
    'BANK_STATEMENT',
    'IdentityProof',
    'AddressProof',
    'IncomeProof',
    'AgeProof',
    'VEHICLE_REGISTRATION_LICENSE',
    'POLLUTION_UNDER_CONTROL_CERTIFICATE',
    'Other'
  ];
  mapRequiredDocuments() {
    if (this.schemeData.requiredDocuments && Array.isArray(this.schemeData.requiredDocuments)) {
      this.mappedRequiredDocuments = this.schemeData.requiredDocuments.map((docIndex: number) => {
        return this.docTypes[docIndex] || `Unknown Document ${docIndex}`;
      });
    } else {
      console.error('Invalid requiredDocuments data:', this.schemeData.requiredDocuments);
    }
  }
   
  closeUploadModal() {
    this.showUploadModal = false;
    this.uploadDocumentName = '';
    this.selectedFile = null;
  }

  // uploadDocument(event: any) {
  //   this.selectedFile = event.target.files[0];
  //   if (this.selectedFile) {
  //     this.customer.uploadDocument(this.selectedFile).subscribe(
  //       (cloudinaryResponse: any) => {
  //         if (!this.selectedCustomer || !this.selectedCustomer.customerId) {
  //           this.toastService.showToast("warn", 'No customer selected. Please select a customer first.');
  //           return;
  //         }
  //         console.log(this.selectedCustomer.customerId);
  
  //         const metadata = {
  //           documentName: this.uploadDocumentName,
  //           documentPath: cloudinaryResponse.url,
  //           customerId: this.selectedCustomer.customerId, // Use the selected customer's ID
  //         };
  //         this.customer.saveMetadataToBackend(metadata).subscribe(
  //           () => {
  //             this.getDocuments(); // Refresh the documents list
  //             this.closeUploadModal(); // Close the modal
  //           },
  //           (error) => {
  //             console.error('Error saving metadata to backend:', error);
  //           }
  //         );
  //       },
  //       (error) => {
  //         console.error('Error uploading to Cloudinary:', error);
  //       }
  //     );
  //   }
  // }
  selectedFiles: File[] = []; // Array to store selected files
  handleFileSelection(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file; // Store the selected file
      console.log(`File selected for ${this.mappedRequiredDocuments[index]}:`, file.name);
    }
  }

  uploadFile(index: number) {
    const selectedFile = this.selectedFiles[index];
    if (!selectedFile) {
       this.toastService.showToast("error",'No file selected.');
      return;
    }
  
    const documentName = this.mappedRequiredDocuments[index];
    this.customer.uploadDocument(selectedFile).subscribe({
      next: (cloudinaryResponse: any) => {
        const metadata = {
          documentName: documentName,
          documentPath: cloudinaryResponse.url,
          customerId: this.selectedCustomer.customerId
        };
  
        this.customer.saveMetadataToBackend(metadata).subscribe({
          next: (metadataResponse: any) => {
            const savedDocumentId = metadataResponse.documentId; // Capture the document ID
           this.uploadedDocuments[documentName] = cloudinaryResponse.url; // Store the uploaded URL
            this.selectedDocumentIds.push(savedDocumentId); // Push document ID to the array
            console.log(this.selectedDocumentIds);
             this.toastService.showToast("success",`${documentName} uploaded successfully.`);
          },
          error: (err: HttpErrorResponse) => {
            console.error(`Error saving metadata for ${documentName}:`, err);
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Error uploading file for ${documentName}:`, err);
      },
    });
  }
  
  loading: boolean = false;

  viewDocument(documentUrl: string) {
    this.loading = true; // Show spinner
    const img = new Image();
    img.onload = () => {
      this.modalImageURL = documentUrl;
      this.loading = false; // Hide spinner when image loads
      this.showModal = true;
    };
    img.onerror = () => {
      this.toastService.showToast("error",'Failed to load the image');
      this.loading = false;
    };
    img.src = documentUrl; // Trigger image preload
  }
  
  closeModal() {
    this.showModal = false;
    this.modalImageURL = '';
  }
  
  
  
  closeViewModal() {
    this.showViewModal = false; // Hide the modal
    this.selectedDocumentUrl = ''; // Clear the document URL
  }


}
