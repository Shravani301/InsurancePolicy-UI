import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private snackBar: MatSnackBar) {} // Inject MatSnackBar

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const userRole = localStorage.getItem('role');
        const isTokenExpired = payload.exp * 1000 < Date.now();

        if (!isTokenExpired) {
          // Check if the role matches if route data contains roles
          if (route.data['role']) {
            if (route.data['role'].indexOf(userRole) !== -1) {
              
              return true; // Role matches and token is valid
            } else {
              // Show toast message for access denied
              this.snackBar.open('Access Denied: You do not have permission to access this page.', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar'], // Optional: Add your custom styles
              });

              // Navigate to login or another page
              this.router.navigateByUrl('/login');
              console.warn('Access denied: Role does not match or token expired.');
              return false; // Role mismatch or expired token
            }
          }
          return true; // No role restrictions and token is valid
        } else {
          console.warn('Token is expired.');
        }
      } catch (e) {
        console.error('Invalid token:', e);
        this.router.navigateByUrl('/login');
        return false;
      }
    }

    alert('You are logged out! Please log in again.');
    setTimeout(() => {
      this.router.navigateByUrl('/login'); // Redirect to home or login
    }, 0);

    return false; // Redirect to login if not authenticated
  }
}
