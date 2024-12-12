import { Component } from '@angular/core';
import { TotalService } from 'src/app/services/total.service';

@Component({
  selector: 'app-customer-landing',
  templateUrl: './customer-landing.component.html',
  styleUrls: ['./customer-landing.component.css']
})
export class CustomerLandingComponent {
  totalPolicies = 0;
  totalDocuments = 0;
  totalAgentCount = 0;
  totalComplaints = 0;
  totalClaimCount = 0;
  customerId: any = '';

  constructor(private total: TotalService) {}

  ngOnInit(): void {
    const storedCustomerId = localStorage.getItem('id');
    if (storedCustomerId) {
      this.customerId = storedCustomerId;
    }
    this.loadAllCounts();
  }

  loadAllCounts(): void {
    this.getTotalAgentCount();
    this.getTotalComplaints();
    this.getTotalClaimCount();
    this.getTotalPolicies();
    this.getTotalDocuments();
  }

  getTotalAgentCount(): void {
    this.total.getAgentsCountByCustomerId(this.customerId).subscribe({
      next: (data) => (this.totalAgentCount = data.body?.count || 0),
      error: (err) => console.error('Error fetching agent count:', err),
    });
  }

  getTotalComplaints(): void {
    this.total.getCustomerQueryCountByCustomerId(this.customerId).subscribe({
      next: (data) => (this.totalComplaints = data.body?.count || 0),
      error: (err) => console.error('Error fetching complaints count:', err),
    });
  }

  getTotalClaimCount(): void {
    this.total.getClaimsCountByCustomerId(this.customerId).subscribe({
      next: (data) => (this.totalClaimCount = data.body?.count || 0),
      error: (err) => console.error('Error fetching claim count:', err),
    });
  }

  getTotalPolicies(): void {
    this.total.getPoliciesCountByCustomerId(this.customerId).subscribe({
      next: (data) => (this.totalPolicies = data.body?.count || 0),
      error: (err) => console.error('Error fetching policies count:', err),
    });
  }

  getTotalDocuments(): void {
    this.total.getDocumentsCountByCustomerId(this.customerId).subscribe({
      next: (data) => (this.totalDocuments = data.body?.count || 0),
      error: (err) => console.error('Error fetching documents count:', err),
    });
  }
}
