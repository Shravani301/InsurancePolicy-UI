import { Component, OnInit } from '@angular/core';
import { TotalService } from 'src/app/services/total.service';

@Component({
  selector: 'app-agent-landing',
  templateUrl: './agent-landing.component.html',
  styleUrls: ['./agent-landing.component.css']
})
export class AgentLandingComponent implements OnInit {
  totalCustomerCount:any='';
  totalPlanCount :any='';
  totalPolicyCount:any='';
  totalAgentCount :any=''; // Example static value
  totalEmployeeCount:any=''; // Example static value
  totalClaimCount :any=''; // Example static value
  totalComplaintCount :any=''; // Example static value
  totalCommissionCount:any='';
  totalPaymentCount :any=''; // Example static value
  agentId: string = '';

  constructor(private totalService: TotalService) {}

  ngOnInit(): void {
    const storedAgentId = localStorage.getItem('id');
    if (storedAgentId) {
      this.agentId = storedAgentId;
      this.loadAgentData();
    }
  }

  loadAgentData(): void {
    this.getTotalCustomerCount();
    this.getTotalPolicyCount();
    this.getTotalCommissionCount();
    this.getTotalPlanCount();
  }

  getTotalCustomerCount(): void {
    this.totalService.getCustomersCountByAgentId(this.agentId).subscribe({
      next: (data) => (this.totalCustomerCount = data.body?.count || 0),
      error: (err) => console.error('Error fetching customer count:', err),
    });
  }
  getTotalPlanCount() {
    this.totalService.getPlanCount().subscribe({
      next: (data: any) => {
        this.totalPlanCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching plan count:', err);
      },
    });
  }

  getTotalPolicyCount(): void {
    this.totalService.getPoliciesCountByAgentId(this.agentId).subscribe({
      next: (data) => (this.totalPolicyCount = data.body?.count || 0),
      error: (err) => console.error('Error fetching policy count:', err),
    });
  }

  getTotalCommissionCount(): void {
    this.totalService.getCommissionsCountByAgentId(this.agentId).subscribe({
      next: (data) => (this.totalCommissionCount = data.body?.count || 0),
      error: (err) => console.error('Error fetching commission count:', err),
    });
  }
}
