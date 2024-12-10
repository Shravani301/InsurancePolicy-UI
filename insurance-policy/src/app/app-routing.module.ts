import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './customer/customer-dashboard/customer-dashboard.component';
import { AgentDashboardComponent } from './agent/agent-dashboard/agent-dashboard.component';
import { EmployeeDashboardComponent } from './employee/employee-dashboard/employee-dashboard.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';
import { AuthGuard } from './guards/auth.guard';
import { ViewCustomersComponent } from './customer/view-customers/view-customers.component';
import { CustomerHeaderComponent } from './customer/customer-header/customer-header.component';
import { CustomerLandingComponent } from './customer/customer-landing/customer-landing.component';
import { TaxSettingComponent } from './admin/tax-setting/tax-setting.component';
import { ViewPlanComponent } from './plan/view-plan/view-plan.component';
import { AddPlanComponent } from './plan/add-plan/add-plan.component';
import { ViewSchemeComponent } from './plan/view-scheme/view-scheme.component';
import { ViewClaimComponent } from './admin/view-claim/view-claim.component';
import { CommissionWithdrawComponent } from './commission-withdraw/commission-withdraw.component';
import { ViewComplaintsComponent } from './employee/view-complaints/view-complaints.component';
import { ViewEmployeeComponent } from './employee/view-employee/view-employee.component';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { ViewPoliciesComponent } from './customer/view-policies/view-policies.component';
import { ViewAgentComponent } from './admin/view-agent/view-agent.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddAgentComponent } from './admin/add-agent/add-agent.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { CustomerProfileComponent } from './customer/customer-profile/customer-profile.component';
import { ShowPlansComponent } from './customer/show-plans/show-plans.component';
import { ShowSchemesComponent } from './customer/show-schemes/show-schemes.component';
import { ShowAgentsComponent } from './customer/show-agents/show-agents.component';
import { ComplaintComponent } from './customer/complaint/complaint.component';
import { ShowComplaintsComponent } from './customer/show-complaints/show-complaints.component';
import { ViewPolicyComponent } from './customer/view-policy/view-policy.component';
import { DocumentComponent } from './customer/document/document.component';
import { PaymentComponent } from './payment/payment.component';
import { BuyPolicyComponent } from './customer/buy-policy/buy-policy.component';
import { ShowClaimsComponent } from './customer/show-claims/show-claims.component';
import { PolicyPaymentsComponent } from './customer/policy-payments/policy-payments.component';
import { AddSchemeComponent } from './admin/add-scheme/add-scheme.component';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      {
        path:'admin-header',  
        component: AdminHeaderComponent
      },
      {
        path:'',  
        component: AdminLandingComponent
      }, 
     
    ],
    canActivate: [AuthGuard],
    data: {
      role: ['Admin'] // Role as an array
    },
  },
  {
    path: 'admin/viewScheme/:id',
    component: ViewSchemeComponent,
  },   
  {
    path:'admin/settings/tax',
    component: TaxSettingComponent
  },
  {
    path:'admin/customers',
    component: ViewCustomersComponent
  },
  {
    path: 'admin/viewPlan',
    component: ViewPlanComponent,
  },
  {
    path: 'admin/addPlan',
    component: AddPlanComponent,
  },
  {
    path: 'admin/viewClaim',
    component: ViewClaimComponent,
  },
  {
    path:'admin/commissions/withdraw',
    component:CommissionWithdrawComponent
  },
  {
    path: 'admin/complaints', 
    component: ViewComplaintsComponent
  },
  {
    path: 'admin/viewAgent',
    component: ViewAgentComponent
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent
  },
  {
    path: 'admin/agent',
    component: AddAgentComponent
  },
  {
    path:'admin/addEmployee',
    component: AddEmployeeComponent
  },
  {
    path:'customer/show-claims',
    component:ShowClaimsComponent
  },
  {
    path: 'dashboard/changePassword',
    component: ChangePasswordComponent
  },{
    path: 'admin/viewEmployees',
    component: ViewEmployeesComponent
  },
  
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: ['Customer'] },
    children:
    [
      {
        path: 'customer-header',
        component: CustomerHeaderComponent,
      },
    
      {
        path: '',
        component: CustomerLandingComponent,
      },
            
    ]
  }, 
  {
    path: 'admin/addScheme/:id',
    component: AddSchemeComponent
  },
  {
    path: 'customer/profile',
    component: CustomerProfileComponent
  },  
  {
    path: 'customer/viewPlan',
    component: ShowPlansComponent
  },
  {
    path: 'customer/document',
    component: DocumentComponent
  },
  {
    path: 'customer/policies',
    component: ViewPoliciesComponent,
  },
  {
    path: 'customer/viewScheme/:id',
    component: ShowSchemesComponent
  },
  {
    path: 'customer/buyPolicy/:id',
    component: BuyPolicyComponent
  },
  {
    path: 'customer/document',
    component: DocumentComponent
  },
  {
    path: 'customer/showAgents',
    component: ShowAgentsComponent
  },
  {
    path: 'customer/add-complaint',
    component: ComplaintComponent
  },
  {
    path: 'customer/showComplaints',
    component: ShowComplaintsComponent
  },
  {
    path: 'customer/Policy/:id',
    component: ViewPolicyComponent
  },
  {
    path: 'customer/Payments/:id',
    component: PolicyPaymentsComponent
  },
  {
    path: 'agent-dashboard',
    component: AgentDashboardComponent,
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
  },
  {
    path: 'view-plan',
    component: ViewPlanComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'admin/viewEmployee',
    component: ViewEmployeesComponent
  },
  
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
