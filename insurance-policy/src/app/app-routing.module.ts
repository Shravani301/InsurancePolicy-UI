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
import { DocumentsComponent } from './customer/documents/documents.component';
import { ViewPoliciesComponent } from './customer/view-policies/view-policies.component';
import { AgentComponent } from './customer/agent/agent.component';


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
  },  {
    path: 'customer/viewPlan',
    component: ViewPlanComponent,
  },
  {
    path: 'customer/policies',
    component: ViewPoliciesComponent,
  },
  {
    path: 'customer/agent',
    component: AgentComponent,
  },
  {
    path: 'customer/viewScheme/:id',
    component: ViewSchemeComponent,
  },
  {
    path: 'customer/documents',
    component: DocumentsComponent
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
