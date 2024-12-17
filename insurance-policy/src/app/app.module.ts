import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './home/overview/overview.component';
import { FeaturesComponent } from './home/features/features.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterEndComponent } from './footer-end/footer-end.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';
import { RecaptchaModule, RecaptchaV3Module } from 'ng-recaptcha';
import { EmployeeDashboardComponent } from './employee/employee-dashboard/employee-dashboard.component';
import { AgentDashboardComponent } from './agent/agent-dashboard/agent-dashboard.component';
import { CustomerDashboardComponent } from './customer/customer-dashboard/customer-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { JwtInterceptor } from './jwt.interceptor';
import { ToastComponent } from './toast/toast.component';
import { ViewCustomersComponent } from './customer/view-customers/view-customers.component';
import { FormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
import { CustomerHeaderComponent } from './customer/customer-header/customer-header.component';
import { CustomerLandingComponent } from './customer/customer-landing/customer-landing.component';
import { TaxSettingComponent } from './admin/tax-setting/tax-setting.component';
import { AddPlanComponent } from './plan/add-plan/add-plan.component';
import { ViewPlanComponent } from './plan/view-plan/view-plan.component';
import { ViewEmployeeComponent } from './employee/view-employee/view-employee.component';
import { ViewSchemeComponent } from './plan/view-scheme/view-scheme.component';
import { ViewClaimComponent } from './admin/view-claim/view-claim.component';
import { CommissionWithdrawComponent } from './commission-withdraw/commission-withdraw.component';
import { ViewComplaintsComponent } from './employee/view-complaints/view-complaints.component';
import { ViewAgentComponent } from './admin/view-agent/view-agent.component';
import { AddAgentComponent } from './admin/add-agent/add-agent.component';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { BuyPolicyComponent } from './customer/buy-policy/buy-policy.component';
import { ViewPoliciesComponent } from './customer/view-policies/view-policies.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ValidateForm } from './helper/validateForm';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { ViewPolicyComponent } from './customer/view-policy/view-policy.component';
import { CustomerProfileComponent } from './customer/customer-profile/customer-profile.component';
import { ShowPlansComponent } from './customer/show-plans/show-plans.component';
import { ShowSchemesComponent } from './customer/show-schemes/show-schemes.component';
import { ShowAgentsComponent } from './customer/show-agents/show-agents.component';
import { ComplaintComponent } from './customer/complaint/complaint.component';
import { ShowComplaintsComponent } from './customer/show-complaints/show-complaints.component';
import { DocumentComponent } from './customer/document/document.component';
import { AgentHeaderComponent } from './agent/agent-header/agent-header.component';
import { CommonModule } from '@angular/common';
import { ShowClaimsComponent } from './customer/show-claims/show-claims.component';
import { ClaimRequestComponent } from './customer/claim-request/claim-request.component';
import { PolicyPaymentsComponent } from './customer/policy-payments/policy-payments.component';
import { AddSchemeComponent } from './admin/add-scheme/add-scheme.component';
import { ViewPaymentsComponent } from './admin/view-payments/view-payments.component';
import { CustomerDocumentsComponent } from './admin/customer-documents/customer-documents.component';
import { AgentLandingComponent } from './agent/agent-landing/agent-landing.component';
import { CustomerRegistrationComponent } from './agent/customer-registration/customer-registration.component';
import { ViewCommissionsComponent } from './agent/view-commissions/view-commissions.component';
import { RegisterPolicyComponent } from './agent/register-policy/register-policy.component';
import { AgentProfileComponent } from './agent/agent-profile/agent-profile.component';
import { EmployeeHeaderComponent } from './employee/employee-header/employee-header.component';
import { ShowCustomersComponent } from './agent/show-customers/show-customers.component';
import { ShowPoliciesComponent } from './agent/show-policies/show-policies.component';
import { WithdrawalsComponent } from './agent/withdrawals/withdrawals.component';
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

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    FeaturesComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegistrationComponent,
    LandingPageComponent,
    FooterEndComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminLandingComponent,
    EmployeeDashboardComponent,
    AgentDashboardComponent,
    CustomerDashboardComponent,
    ToastComponent,
    ViewCustomersComponent,
    PaymentComponent,
    SuccessComponent,
    CustomerHeaderComponent,
    CustomerLandingComponent,
    TaxSettingComponent,
    AddPlanComponent,
    ViewPlanComponent,
    ViewEmployeeComponent,
    ViewSchemeComponent,
    ViewClaimComponent,
    CommissionWithdrawComponent,
    ViewComplaintsComponent,
    ViewAgentComponent,
    AddAgentComponent,
    ViewEmployeesComponent,
    BuyPolicyComponent,
    ViewPoliciesComponent,
    AdminProfileComponent,
    ChangePasswordComponent,
    AddEmployeeComponent,
    ViewPolicyComponent,
    CustomerProfileComponent,
    ShowPlansComponent,
    ShowSchemesComponent,
    ShowAgentsComponent,
    ComplaintComponent,
    ShowComplaintsComponent,
    DocumentComponent,
    AgentHeaderComponent,
    ShowClaimsComponent,
    ClaimRequestComponent,
    PolicyPaymentsComponent,
    AddSchemeComponent,
    ViewPaymentsComponent,
    CustomerDocumentsComponent,
    AgentLandingComponent,
    CustomerRegistrationComponent,
    ViewCommissionsComponent,
    RegisterPolicyComponent,
    AgentProfileComponent,
    EmployeeHeaderComponent,
    ShowCustomersComponent,
    ShowPoliciesComponent,
    WithdrawalsComponent,
    EmployeeLandingComponent,
    EmployeeProfileComponent,
    AdminOperationsComponent,
    EmployeeOperationsComponent,
    ApplicationsComponent,
    AgentOperationsComponent,
    CustomerOperationsComponent,
    AboutUsComponent,
    ServicesComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule, // Required for making HTTP requests
    MatSnackBarModule, // Material Snackbar module
    ToastModule, // PrimeNG Toast module
    BrowserAnimationsModule, // Required for animations
    RecaptchaModule,
    RecaptchaV3Module,
    FormsModule,
    CommonModule, 
    
  ],
  providers: [MessageService,
    {
      provide:HTTP_INTERCEPTORS, useClass:JwtInterceptor,
      multi: true
    },
    {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    },
    
},], // Provide MessageService for PrimeNG Toast
  bootstrap: [AppComponent],
})
export class AppModule {}
