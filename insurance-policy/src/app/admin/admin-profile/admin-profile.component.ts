import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent {
  adminProfile: any;
  isEditing: boolean = false; // To toggle edit mode
  editableUserName: string = '';

  constructor(private admin: AdminService, private location: Location,private toastService:ToastService) {}

  ngOnInit() {
    this.admin.getProfile().subscribe({
      next: (res) => {
        this.adminProfile = res;
        this.editableUserName = this.adminProfile.userName; // Initialize editable field
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Restore original value when canceled
      this.editableUserName = this.adminProfile.userName;
    }
  }

  updateUserName() {
    const Id = this.adminProfile.AdminId;
    console.log(Id);
    this.adminProfile.userName = this.editableUserName

    this.admin.updateProfile(this.adminProfile).subscribe({
      next: (res:any) => {
        this.toastService.showToast("success", 'Profile updated successfully!'); // Show success toast
        this.adminProfile.userName = this.editableUserName; // Update local value
        this.isEditing = false; // Exit editing mode
        console.log('UserName updated successfully');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating UserName:', err);
      }
    });
  }
}
