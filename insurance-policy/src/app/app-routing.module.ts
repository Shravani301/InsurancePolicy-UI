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
import { ViewClaimsComponent } from './employee/view-claims/view-claims.component';


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
    path:'admin/customers',
    component: ViewCustomersComponent
  },
  {
    path:'admin/claims',
    component: ViewClaimsComponent
  },
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: ['Customer'] }
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
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
