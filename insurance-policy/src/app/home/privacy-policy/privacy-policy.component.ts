import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent {
  policies = [
    {
      title: 'Data Privacy',
      description:
        'We are committed to protecting your data. Your personal information will not be shared with third parties without consent.',
    },
    {
      title: 'Secure Transactions',
      description:
        'All transactions conducted on our platform are encrypted with the latest security technologies.',
    },
    {
      title: 'Terms of Service',
      description:
        'By using our platform, you agree to our terms and conditions that include responsible usage and compliance.',
    },
    {
      title: 'User Consent',
      description:
        'We seek user consent before storing or processing any personal information to comply with regulations.',
    },
    {
      title: 'Cookies Policy',
      description:
        'We use cookies to improve your experience. By using our services, you agree to our cookie usage policy.',
    },
  ];
}
