import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tax-setting',
  templateUrl: './tax-setting.component.html',
  styleUrls: ['./tax-setting.component.css']
})
export class TaxSettingComponent {
  taxId: string = 'ba1830ae-4cb1-ef11-ac89-9d80da5fbf90'; // Fixed Tax ID
  taxPercentage: number | null = null; // To store user input for Tax Percentage

  constructor(private taxService: AdminService, private location: Location, private toastService: ToastService) {} // Inject Location service

  // Method to handle form submission
  onUpdateTax() {
    if (this.taxPercentage !== null) {
      this.taxService.updateTax(this.taxId, this.taxPercentage).subscribe({
        next: () => {
          this.toastService.showToast('success', 'update successful!');
        },
        error: (err) => {
          console.error('Failed to update tax settings:', err);
          this.toastService.showToast('error','Failed to update tax settings.');
        },       
      });
    }
  }

  // Go back to the previous page
  goBack(): void {
    this.location.back();
  }
}
