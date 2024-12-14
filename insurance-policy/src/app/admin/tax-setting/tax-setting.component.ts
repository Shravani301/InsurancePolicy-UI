import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tax-setting',
  templateUrl: './tax-setting.component.html',
  styleUrls: ['./tax-setting.component.css'],
})
export class TaxSettingComponent {
  taxId: string = ''; // To dynamically store the Tax ID
  taxPercentage: number | null = null; // To store the current tax percentage
  updatedTaxPercentage: number | null = null; // For user-entered updates
  isSubmitted: boolean = false; // To track form submission

  constructor(
    private taxService: AdminService,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Fetch tax settings without passing an ID
    this.taxService.getTax().subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.taxId = response[0].taxId;
          this.taxPercentage = response[0].taxPercentage;
          console.log('Tax settings fetched successfully:', this.taxPercentage);
        }
      },
      error: (err) => {
        console.error('Failed to fetch tax settings:', err);
        this.toastService.showToast('error', 'Failed to load tax settings.');
      },
    });
  }

  // Method to handle form submission
  onUpdateTax() {
    this.isSubmitted = true; // Mark the form as submitted

    if (this.updatedTaxPercentage === null) {
      this.toastService.showToast('warn', 'Tax percentage is required.');
      return;
    }

    if (
      this.updatedTaxPercentage < 0.01 ||
      this.updatedTaxPercentage > 18
    ) {
      this.toastService.showToast(
        'warn',
        'Tax percentage must be between 0.01 and 18%.'
      );
      return;
    }

    const formattedTaxPercentage = parseFloat(
      this.updatedTaxPercentage.toFixed(2)
    ); // Round to 2 decimals

    this.taxService.updateTax(this.taxId, formattedTaxPercentage).subscribe({
      next: () => {
        this.taxPercentage = formattedTaxPercentage; // Update the displayed value
        this.updatedTaxPercentage = null; // Reset the input field
        this.isSubmitted = false; // Reset submission state
        this.toastService.showToast('success', 'Tax updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update tax settings:', err);
        this.toastService.showToast('error', 'Failed to update tax settings.');
      },
    });
  }

  // Go back to the previous page
  goBack(): void {
    this.location.back();
  }
}
