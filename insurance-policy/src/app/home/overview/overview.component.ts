import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  slides = [
    {
      image: 'assets/images/insurance-2.jpg',
      title: 'Hassle-Free Insurance',
      description: 'Fast, easy, and reliable insurance policies.',
    },
    {
      image: 'assets/images/insurance-1.jpg',
      title: 'Secure Your Future',
      description: 'Get the right coverage for you and your family.',
    },
    
    {
      image: 'assets/images/insurance-3.jpg',
      title: 'Your Trusted Partner',
      description: 'We are here to protect what matters most.',
    },
    {
      image: 'assets/images/insurance-4.jpg',
      title: 'Affordable Plans',
      description: 'Insurance plans that fit your budget.',
    },
    {
      image: 'assets/images/insurance-5.png',
      title: '24/7 Support',
      description: 'Our dedicated team is here to assist you anytime.',
    },
  ];
}
