import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-landing',
  templateUrl: './customer-landing.component.html',
  styleUrls: ['./customer-landing.component.css']
})
export class CustomerLandingComponent {
totalPolicies = 2;
  totalDocuments = 4;
  totalAgentCount = 1;
  totalComplaints = 5;
  totalClaimCount = 6;
}
