import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  template: `
    <h1>Stripe Payment Integration</h1>
    <button (click)="pay()">Pay with Stripe</button>
    <div *ngIf="error" style="color: red;">{{ error }}</div>
  `,
  styles: [
    `
      button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #6772e5;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export class PaymentComponent {
  private stripePromise = loadStripe('pk_test_51OYCJzSJHtcsvReHAtsh16WRURPowJL6fM4bc1SRnQ65k9qdquB49rE36TfYg9RrC8zrtK8fnByZZsTzcMjy3vVd00J6l5xnpV'); // Your publishable key
  error: any = null;

  constructor(private http: HttpClient) {}

  async pay(): Promise<void> {
    try {
      // Call the backend to create a checkout session
      const response = await this.http
        .post<{ sessionId: string }>('http://localhost:5000/api/Stripe/create-checkout-session', {
          amount: 1000, // Amount in cents (e.g., $10)
        })
        .toPromise();

      const sessionId = response?.sessionId; // Optional chaining to handle undefined

      if (!sessionId) {
        this.error = 'Failed to get session ID.';
        return;
      }

      const stripe = await this.stripePromise;

      if (!stripe) {
        this.error = 'Stripe failed to load.';
        return;
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        this.error = error.message;
        console.error('Stripe Checkout Error:', error);
      }
    } catch (err: any) {
      this.error = err.message || 'An error occurred.';
      console.error('Error:', err);
    }
  }
}
