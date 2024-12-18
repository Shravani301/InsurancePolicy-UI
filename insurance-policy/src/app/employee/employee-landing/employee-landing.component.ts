import { Component } from '@angular/core';
import { TotalService } from 'src/app/services/total.service';

@Component({
  selector: 'app-employee-landing',
  templateUrl: './employee-landing.component.html',
  styleUrls: ['./employee-landing.component.css']
})
export class EmployeeLandingComponent {
   totalCustomerCount: any='';
    totalPlanCount: any='';
    totalAgentCount: any='';
    totalEmployeeCount: any='';
    totalClaimCount: any='';
    totalComplaintCount: any='';
    totalCommissionCount: any= '';
    totalPaymentCount: any= '';
    totalWithdrawl: any= '';
  
    constructor(private total: TotalService) {}
  
    ngOnInit(): void {
      this.getTotalCustomerCount();
      this.getTotalPlanCount();
      this.getTotalAgentCount();
      this.getTotalWithdrawl();
      this.getTotalComplaintCount();
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
  
  
  }
  