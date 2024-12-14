import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css'],
})
export class AddAgentComponent implements OnInit {
  addAgentForm: FormGroup;
  showCancelEditModal: boolean = false;

  hidePassword: boolean = true; // Default to hiding the password

  constructor(
    private adminService: AdminService,
    private location: Location,
    private toastService: ToastService
  ) {
    // Initialize the form with validation rules
    this.addAgentForm = new FormGroup({
      agentFirstName: new FormControl('', [
        Validators.required,
        ValidateForm.onlyCharactersValidator,
        Validators.minLength(3),
      ]),
      agentLastName: new FormControl('', [
        Validators.required,
        ValidateForm.onlyCharactersValidator,
      ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      qualification: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        ValidateForm.passwordPatternValidator,
      ]),
    });
  }

  ngOnInit(): void {}

  /**
   * Adds a new agent after validating the form.
   */
  addAgent(): void {
    if (this.addAgentForm.valid) {
      console.log('Submitting:', this.addAgentForm.value);
      this.adminService.addAgent(this.addAgentForm.value).subscribe({
        next: (data) => {
          console.log('Response:', data);
          this.toastService.showToast('success', 'Agent added successfully');
          this.goBack();
          this.addAgentForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error:', error.message);
          this.toastService.showToast(
            'error',
            error.error?.errorMessage || 'An error occurred while adding the agent'
          );
        },
      });
    } else {
      ValidateForm.validateAllFormFileds(this.addAgentForm);
      this.toastService.showToast('warn', 'Please fill out all required fields');
    }
  }

  /**
   * Reloads the page after successful submission.
   */
  reloadPage(): void {
    location.reload();
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Resets the form on cancel, with a confirmation dialog.
   */
  onCancel(): void {
    if (confirm('Are you sure you want to discard changes?')) {
      this.addAgentForm.reset();
    }
  }

  /**
   * Navigates back to the previous page.
   */
  goBack(): void {
    this.location.back();
  }
  openCancelModal(): void {
    if(this.addAgentForm.valid||this.addAgentForm.invalid)
    this.showCancelEditModal = true;
  }

  closeCancelModal(): void {
    this.showCancelEditModal = false;
  }

  discardChanges(): void {
    this.addAgentForm.reset();
    this.closeCancelModal();
  }
}
