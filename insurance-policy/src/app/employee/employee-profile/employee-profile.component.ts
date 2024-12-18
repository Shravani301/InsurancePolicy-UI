import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  employeeProfile: any = {};
  empId: string = '';
  isEditing: boolean = false; // Edit mode toggle
  editableUserName: string = ''; // Editable UserName field

  constructor(private employee: EmployeeService, private location: Location) {}

  ngOnInit() {
    const storedId = localStorage.getItem('id');
    if (!storedId) {
      console.error('Employee ID is not available in local storage');
      return;
    }

    this.empId = storedId;
    this.getEmployeeProfile();
  }

  getEmployeeProfile() {
    this.employee.getEmployeeProfile(this.empId).subscribe({
      next: (response) => {
        this.employeeProfile = response.body;
        this.editableUserName = this.employeeProfile.userName; // Initialize editable field
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch employee profile:', err.message);
      },
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset the editable field on cancel
      this.editableUserName = this.employeeProfile.userName;
    }
  }

  updateUserName() {
    if (this.editableUserName.trim() === '') {
      alert('UserName cannot be empty!');
      return;
    }

    const updatedData = { userName: this.editableUserName };
    this.employeeProfile.userName = updatedData.userName;

    this.employee.updateProfile(this.employeeProfile).subscribe({
      next: () => {
        this.employeeProfile.userName = this.editableUserName; // Update UI with new value
        this.isEditing = false;
        alert('UserName updated successfully!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating UserName:', err);
        alert('Failed to update UserName.');
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
