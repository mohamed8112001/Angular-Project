import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isPublicPage(): boolean {
    const currentPath = window.location.pathname;
    return currentPath === '/home' || currentPath === '/' ;
  }

  constructor(private router: Router) {}

  isStudentPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/student') ;
  }

  isHiddenPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login') || url === '/register';
  }
}
