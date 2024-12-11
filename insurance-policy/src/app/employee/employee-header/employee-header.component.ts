import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employee-header',
  templateUrl: './employee-header.component.html',
  styleUrls: ['./employee-header.component.css']
})
export class EmployeeHeaderComponent {
  constructor(private auth:AuthService, private route:Router){}
  logOut() {
    localStorage.removeItem('id');
    this.auth.logout();
  }

}
