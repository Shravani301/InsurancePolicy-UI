import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  amount = 100; // You can dynamically set this value based on your requirement.
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  ngOnInit() {
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
  }
}