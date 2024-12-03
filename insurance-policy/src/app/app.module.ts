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
import { HttpClientModule } from '@angular/common/http';
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
  ],
  providers: [MessageService,{
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
