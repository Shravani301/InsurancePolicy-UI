import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent {
  services = [
    {
      icon: 'assets/icons/1.png', // Replace with appropriate image path
      title: 'Vehicle Insurance',
      description:
        'Protect your vehicle from accidents, theft, and damage with our comprehensive vehicle insurance plans.',
    },
    {
      icon: 'assets/icons/4.png', // Replace with appropriate image path
      title: 'Health Insurance',
      description:
        'Ensure your health is safeguarded with tailored plans that cover medical emergencies, hospitalization, and more.',
    },
    {
      icon: 'assets/icons/5.png', // Replace with appropriate image path
      title: 'Property Insurance',
      description:
        'Secure your home, business, and property against fire, natural disasters, and unforeseen damages.',
    },
    {
      icon: 'assets/icons/7.png', // Replace with appropriate image path
      title: 'Life Insurance',
      description:
        'Guarantee financial stability for your loved ones with life insurance plans that offer maximum coverage and peace of mind.',
    },
    {
      icon: 'assets/icons/2.png', // Replace with appropriate image path
      title: 'Travel Insurance',
      description:
        'Travel stress-free with insurance plans that cover medical emergencies, lost baggage, and flight delays during your journey.',
    },
    {
      icon: 'assets/icons/0.png', // Replace with a suitable icon
      title: 'And Many More',
      description:
        'Explore a wide range of additional insurance plans tailored for your needs, including education, pet insurance, and much more.',
    },
  ];
}
