import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/services/agent.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  employeeProfile:any={}
  empId:any='';
  constructor(private employee:EmployeeService, private location: Location) {}

  ngOnInit() {
    const storedId = localStorage.getItem('id'); // Retrieve the customer ID from local storage
    if(!storedId)
      console.log('Employee profile not found');

    this.empId = storedId;
  
    if (this.empId) {
      this.employee.getEmployeeProfile(this.empId).subscribe({
        next: (response) => {
          this.employeeProfile = response.body; // Access the response body
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch customer profile:', err.message);
        }
      });
    } else {
      console.error('Customer ID is not available in local storage');
    }
  }
  

  goBack() {
    this.location.back(); // Navigate back to the previous page
  }
}