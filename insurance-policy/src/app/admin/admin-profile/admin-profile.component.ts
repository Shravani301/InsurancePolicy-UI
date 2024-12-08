import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent {
adminProfile:any
constructor(private admin:AdminService,private location:Location){}

ngOnInit(){
  this.admin.getProfile().subscribe({
    next:(res)=>{
      this.adminProfile=res;
    },
    error:(err:HttpErrorResponse)=>{
      console.log(err);
    }
  })
}
goBack(){
  this.location.back()
}
}
