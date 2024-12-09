import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  amount: number = 0; // Dynamically set this value from route params
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Fetch the amount from the route parameter
    this.amount = +this.route.snapshot.queryParamMap.get('amount')!;

    if (this.amount > 0) {
      paypal
        .Buttons({
          style: {
            layout: 'horizontal',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: this.amount.toString(),
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              console.log('Payment success!', details);
            });
          },
          onError: (err: any) => {
            console.log('Payment failed!', err);
          },
        })
        .render(this.paymentRef.nativeElement);
    } else {
      console.error('Invalid payment amount!');
    }
  }
}
