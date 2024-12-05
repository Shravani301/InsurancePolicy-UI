import { Injectable } from '@angular/core';

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warn';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: ToastMessage[] = [];

  // Add a toast message
  showToast(type: 'success' | 'error' | 'info' | 'warn', message: string) {
    this.toasts.push({ type, message });

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      this.toasts.shift();
    }, 3000);
  }

  // Clear all toasts
  clearToasts() {
    this.toasts = [];
  }
}
