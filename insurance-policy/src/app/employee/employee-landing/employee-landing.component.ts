import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-landing',
  templateUrl: './employee-landing.component.html',
  styleUrls: ['./employee-landing.component.css']
})
export class EmployeeLandingComponent {
  totalCustomerCount = 150;
  totalPlanCount = 80;
  totalAgentCount = 45;
  totalEmployeeCount = 20;
  totalClaimCount = 120;
  totalComplaintCount = 10;
  totalCommissionCount = 50;
  totalPaymentCount = 200;
}
