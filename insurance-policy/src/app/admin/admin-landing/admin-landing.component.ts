import { Component, OnInit } from '@angular/core';
import { TotalService } from 'src/app/services/total.service';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {
  totalCustomerCount: any='';
  totalPlanCount: any='';
  totalAgentCount: any='';
  totalEmployeeCount: any='';
  totalClaimCount: any='';
  totalComplaintCount: any='';
  totalCommissionCount: any= '';
  totalPaymentCount: any= '';
  totalWithdrawl: any='';
  constructor(private total: TotalService) {}

  ngOnInit(): void {
    this.getTotalCustomerCount();
    this.getTotalPlanCount();
    this.getTotalAgentCount();
    this.getTotalEmployeeCount();
    this.getTotalClaimCount();
    this.getTotalComplaintCount();
    this.getTotalCommissionCount();
    this.getTotalPaymentCount();
    this.getTotalWithdrawl();
  }

  getTotalCustomerCount() {
    this.total.getCustomerCount().subscribe({
      next: (data:any) => {
        this.totalCustomerCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching customer count:', err);
      },
    });
  }

  getTotalPlanCount() {
    this.total.getPlanCount().subscribe({
      next: (data: any) => {
        this.totalPlanCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching plan count:', err);
      },
    });
  }

  getTotalAgentCount() {
    this.total.getAgentCount().subscribe({
      next: (data: any) => {
        this.totalAgentCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching agent count:', err);
      },
    });
  }

  getTotalEmployeeCount() {
    this.total.getEmployeeCount().subscribe({
      next: (data:any) => {
        this.totalEmployeeCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching employee count:', err);
      },
    });
  }
  
  getTotalWithdrawl() {
    this.total.getWithdrawlCount().subscribe(
      {
        next: (data:any) => {
          this.totalWithdrawl = data.body.count;
        },
        error: (err) => {
          console.error('Error fetching customer count:', err);
        },
      });
  }

  getTotalClaimCount() {
    this.total.getClaimCount().subscribe({
      next: (data: any) => {
        this.totalClaimCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching claim count:', err);
      },
    });
  }

  getTotalComplaintCount() {
    this.total.getComplaintCount().subscribe({
      next: (data: any) => {
        this.totalComplaintCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching complaint count:', err);
      },
    });
  }

  getTotalCommissionCount() {
    this.total.getCommissionCount().subscribe({
      next: (data: any) => {
        this.totalCommissionCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching commission count:', err);
      },
    });
  }

  getTotalPaymentCount() {
    this.total.getPaymentCount().subscribe({
      next: (data:any) => {
        this.totalPaymentCount = data.body.count;
      },
      error: (err) => {
        console.error('Error fetching payment count:', err);
      },
    });
  }
}
