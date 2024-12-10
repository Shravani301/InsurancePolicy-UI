import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-landing',
  templateUrl: './agent-landing.component.html',
  styleUrls: ['./agent-landing.component.css']
})
export class AgentLandingComponent {
  totalCustomerCount = 150;
  totalPlanCount = 80;
  totalAgentCount = 45;
  totalEmployeeCount = 20;
  totalClaimCount = 120;
  totalComplaintCount = 10;
  totalCommissionCount = 50;
  totalPaymentCount = 200;
}
