import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent {
    totalCustomerCount = 150;
    totalPlanCount = 80;
    totalAgentCount = 45;
    totalEmployeeCount = 20;
    totalClaimCount = 120;
    totalComplaintCount = 10;
    totalCommissionCount = 50;
    totalPaymentCount = 200;
}
