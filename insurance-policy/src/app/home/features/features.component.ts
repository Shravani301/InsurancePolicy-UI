import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeaturesComponent {
  features = [
    {
      icon: 'assets/stop-watch.png', // Replace with appropriate icons
      title: '5-Minute Policy Issuance*',
      description:
        'Avoid long queues and excessive paperwork. With eInsurance Portal, issue your policy instantly and hassle-free within just 5 minutes.',
    },
    {
      icon: 'assets/secure.png', // New icon for security
      title: 'Secure and Reliable Transactions',
      description:
        'We prioritize your data’s security. All transactions are protected with advanced encryption to ensure a secure experience.',
    },
    {
      icon: 'assets/headset.png',
      title: '24/7 Dedicated Support Team',
      description:
        'Our expert support team is here to assist you around the clock. Whether it’s policy queries or claim support, we’re always ready to help.',
    },
  ];
}
