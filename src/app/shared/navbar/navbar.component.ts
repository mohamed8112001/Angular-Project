import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userRole = '';
  username = '';
  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();

    // Listen to route changes to update auth status
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          this.logout();
          return;
        }

        this.isLoggedIn = true;
        this.userRole = tokenPayload.role || '';
        this.username = tokenPayload.email || tokenPayload.username || 'User';
      } catch (error) {
        console.error('Error parsing token:', error);
        this.logout();
      }
    } else {
      this.isLoggedIn = false;
      this.userRole = '';
      this.username = '';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.userRole = '';
    this.username = '';
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  isStudent(): boolean {
    return this.userRole === 'student';
  }
}
