import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  contactInfo = {
    address: 'Plot 204, VSR HEIGHTS, Vasanth Nagar Colony, Kakatiya Hills, Pragathi Nagar, Nizampet, Hyderabad, Telangana, 500090. ',
    email: 'dheerajkumar14.a@gmail.com',
    phone: '+91 7013410921',
    // hours: 'Mon - Sat: 9:00 AM to 6:00 PM',
  };
  constructor(private adminService: AdminService,private toastService:ToastService){}

  baseUrl:any='http://localhost:7052/api/ContactUs'
ContactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required,Validators.pattern('^[0-9]{10}$')]),
    message:new FormControl('', Validators.required),
  });

  socialLinks = [
    { icon: 'fab fa-facebook-f', link: 'https://facebook.com/einsurance' },
    { icon: 'fab fa-twitter', link: 'https://twitter.com/einsurance' },
    { icon: 'fab fa-linkedin-in', link: 'https://linkedin.com/einsurance' },
  ];
  isInvalid(controlName: string): boolean {
    const control = this.ContactForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
  onSubmitData(): void {
    if(this.ContactForm.valid)
    {
      this.adminService.contactUs(this.ContactForm.value).subscribe(()=>{
        this.toastService.showToast("success",'Message sent successfully');
        this.ContactForm.reset();
      });  
    }
    else{
      this.toastService.showToast("error",'please complete all the details');
    }  
  }
}
