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
import { ViewPaymentsComponent } from './admin/view-payments/view-payments.component';
import { CustomerDocumentsComponent } from './admin/customer-documents/customer-documents.component';
import { ClaimRequestComponent } from './customer/claim-request/claim-request.component';
import { AgentHeaderComponent } from './agent/agent-header/agent-header.component';
import { AgentLandingComponent } from './agent/agent-landing/agent-landing.component';
import { CustomerRegistrationComponent } from './agent/customer-registration/customer-registration.component';
import { ViewCommissionsComponent } from './agent/view-commissions/view-commissions.component';
import { RegisterPolicyComponent } from './agent/register-policy/register-policy.component';
import { AgentProfileComponent } from './agent/agent-profile/agent-profile.component';
import { ShowCustomersComponent } from './agent/show-customers/show-customers.component';
import { ShowPoliciesComponent } from './agent/show-policies/show-policies.component';
import { WithdrawalsComponent } from './agent/withdrawals/withdrawals.component';
import { EmployeeHeaderComponent } from './employee/employee-header/employee-header.component';
import { EmployeeLandingComponent } from './employee/employee-landing/employee-landing.component';
import { EmployeeProfileComponent } from './employee/employee-profile/employee-profile.component';


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
    path: 'admin/customer/documnets/:id',
    component: CustomerDocumentsComponent
  },
  {
    path: 'admin/customer/policies/:id',
    component: ViewPoliciesComponent,
  },
  {
    path: 'employee/customer/policies/:id',    
    component: ViewPoliciesComponent,
  },
  {
    path:'admin/payments',
    component:ViewPaymentsComponent
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
    path: 'agent/viewPlan',
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
    path: 'customer/claimRequest/:id',
    component: ClaimRequestComponent,
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
    children: [
      {
        path:'agent-header',  
        component: AgentHeaderComponent
      },
      {
        path:'',  
        component: AgentLandingComponent
      },     
    ],
    canActivate: [AuthGuard],
    data: {
      role: ['Agent'] // Role as an array
    },
  },
  {
    path: 'agent/viewScheme/:id',
    component: ShowSchemesComponent
  },
  {
    path:'agent/customerRegistration',
    component:CustomerRegistrationComponent

  },
  {
    path:'agent/commissions',
    component:ViewCommissionsComponent

  },
  {
    path: 'agent/registerPolicy/:id',
    component: RegisterPolicyComponent
  },
  {
    path: 'agent/profile',
    component: AgentProfileComponent
  },
  {
    path: 'agent/customers',
    component:ShowCustomersComponent
  },
  {
    path: 'employee/Policy/:id/:id1',
    component: ViewPolicyComponent
},
{
  path: 'admin/Policy/:id/:id1',
  component: ViewPolicyComponent
},
  {
    path: 'agent/policies',
    component:ShowPoliciesComponent
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
    children: [
      {
        path:'employee-header',  
        component: EmployeeHeaderComponent
      },
      {
        path:'',  
        component: EmployeeLandingComponent
      },  
    ]  ,
    canActivate: [AuthGuard],
    data: {
      role: ['Employee'] // Role as an array
    },
  },
  {
    path:'employee/customers',
    component: ViewCustomersComponent
  },
  {
    path:'employee/profile',
    component: EmployeeProfileComponent
  },
  {
    path: 'employee/customer/documnets/:id',
    component: CustomerDocumentsComponent
  },
  {
    path: 'agent/withdrawls',
    component: WithdrawalsComponent
  },
  {
    path: 'employee/agent',
    component: AddAgentComponent
  },
  {
    path: 'view-plan',
    component: ViewPlanComponent,
  },
  {
    path: 'employee/viewAgent',
    component: ViewAgentComponent
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
