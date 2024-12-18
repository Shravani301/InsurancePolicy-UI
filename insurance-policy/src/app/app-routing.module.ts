import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
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
import { AdminOperationsComponent } from './admin/admin-operations/admin-operations.component';
import { EmployeeOperationsComponent } from './employee/employee-operations/employee-operations.component';
import { ApplicationsComponent } from './employee/applications/applications.component';
import { AgentOperationsComponent } from './agent/agent-operations/agent-operations.component';
import { CustomerOperationsComponent } from './customer/customer-operations/customer-operations.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServicesComponent } from './home/services/services.component';
import { PrivacyPolicyComponent } from './home/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './home/contact-us/contact-us.component';


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
    path: 'admin',
    component: AdminOperationsComponent,
    children: [
    {
      path:'addEmployee',
      component: AddEmployeeComponent
    },
    {
      path: 'viewEmployees',
      component: ViewEmployeesComponent
    },
    {
      path:'settings/tax',
      component: TaxSettingComponent
    },
    {
      path: 'viewPlan',
      component: ViewPlanComponent,
    },
    {
      path: 'addPlan',
      component: AddPlanComponent,
    },
    {
      path: 'addScheme/:id',
      component: AddSchemeComponent
    },
    {
      path: 'viewAgent',
      component: ViewAgentComponent
    },    
    {
      path: 'viewScheme/:id',
      component: ViewSchemeComponent,
    },  
    {
      path:'addAgent',
      component: AddAgentComponent
    },
    {
      path:'customers',
      component: ViewCustomersComponent
    },
    {
      path: 'viewClaim',
      component: ViewClaimComponent,
    },
    {
      path: 'complaints', 
      component: ViewComplaintsComponent
    },
    {
      path:'commissions/withdraw',
      component:CommissionWithdrawComponent
    },
    {
      path:'payments',
      component:ViewPaymentsComponent
    },
    {
      path: 'customer/documnets/:id',
      component: CustomerDocumentsComponent
    },
    {
      path: 'customer/policies/:id',
      component: ViewPoliciesComponent,
    },
    {
      path: 'customer/policies/:id',    
      component: ViewPoliciesComponent,
    },
    {
      path: 'customer/documnets/:id',
      component: CustomerDocumentsComponent
    },
    {
      path: 'customer/policies/:id',
      component: ViewPoliciesComponent,
    },
    {
      path: 'Policy/:id/:id1',
      component: ViewPolicyComponent
    },
    {
      path: 'profile',
      component: AdminProfileComponent
    },
    
  ],
  canActivate: [AuthGuard],
    data: {
      role: ['Admin'] // Role as an array
    },
   
  }, 
  


  {
    path: 'employee',
    component: EmployeeOperationsComponent,
    children: [
      {
        path:'addAgent',
        component: AddAgentComponent
      },
      {
        path:'viewAgent',
        component: ViewAgentComponent
      },
      {
        path:'customers',
        component: ViewCustomersComponent
      },
      {
        path:'profile',
        component: EmployeeProfileComponent
      },
      {
        path: 'Policy/:id/:id1',
        component: ViewPolicyComponent
      },
      {
        path:'commissions/withdraw',
        component:CommissionWithdrawComponent
      },
      {
        path: 'complaints', 
        component: ViewComplaintsComponent
      },
      {
        path:'applications',
        component:ApplicationsComponent
      },
      {
        path: 'customer/documnets/:id',
        component: CustomerDocumentsComponent
      },
      {
        path:'customers',
        component: ViewCustomersComponent
      },
    
    {
      path: 'customer/policies/:id',    
      component: ViewPoliciesComponent,
    },   
      
    ],
    canActivate: [AuthGuard],
    data: {
      role: ['Employee'] // Role as an array
    },
  },





  {
    path: 'agent',
    component: AgentOperationsComponent,
    children: [
      {
        path: 'viewPlan',
        component: ShowPlansComponent
      },
      {
        path: 'viewScheme/:id',
        component: ShowSchemesComponent
      },
      {
        path:'commissions/withdraw',
        component:CommissionWithdrawComponent
      },
      {
        path:'customerRegistration',
        component:CustomerRegistrationComponent
    
      },
      {
        path:'commissions',
        component:ViewCommissionsComponent
    
      },
      {
        path: 'registerPolicy/:id',
        component: RegisterPolicyComponent
      },
      {
        path: 'profile',
        component: AgentProfileComponent
      },
      {
        path: 'customers',
        component:ShowCustomersComponent
      },
      
  {
    path: 'withdrawls',
    component: WithdrawalsComponent
  },
  {
    path: 'policies',
    component:ShowPoliciesComponent
  },
    ],
    canActivate: [AuthGuard],
    data: {
      role: ['Agent'] // Role as an array
    },
  },


  {
    path: 'customer',
    component: CustomerOperationsComponent,
    children: [
      {
        path: 'profile',
        component: CustomerProfileComponent
      },  
      {
        path: 'viewPlan',
        component: ShowPlansComponent
      },
     
      {
        path: 'document',
        component: DocumentComponent
      },
      {
        path: 'policies',
        component: ViewPoliciesComponent,
      },
      {
        path: 'viewScheme/:id',
        component: ShowSchemesComponent
      },
      {
        path: 'buyPolicy/:id',
        component: BuyPolicyComponent
      },
      {
        path: 'document',
        component: DocumentComponent
      },
      {
        path: 'showAgents',
        component: ShowAgentsComponent
      },
      {
        path: 'claimRequest/:id',
        component: ClaimRequestComponent,
      },
      {
        path: 'add-complaint',
        component: ComplaintComponent
      },
      {
        path: 'showComplaints',
        component: ShowComplaintsComponent
      },
      {
        path:'show-claims',
        component:ShowClaimsComponent
      },
      {
        path: 'Policy/:id',
        component: ViewPolicyComponent
      },
      {
        path: 'Payments/:id',
        component: PolicyPaymentsComponent
      },
      
    ],
    canActivate: [AuthGuard],
    data: {
      role: ['Customer'] // Role as an array
    },
  }

  ,
  {
    path: 'dashboard/changePassword',
    component: ChangePasswordComponent
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
    path: 'view-plan',
    component: ViewPlanComponent,
  },
  
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path:'aboutUs',
    component: AboutUsComponent
  },
  {
    path:'services',
    component: ServicesComponent
  }, 
  {
    path:'privacyPolicy',
    component: PrivacyPolicyComponent
  },
  {
    path:'contactUs',
    component: ContactUsComponent	
  },
  
  {
    path: '**',
    redirectTo: '',
  },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled', // Enables fragment scrolling
  onSameUrlNavigation: 'reload',
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
