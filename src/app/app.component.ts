import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'student-management-front-v3';

  showNavbar: boolean = false;
  constructor(private router: Router) {
    // Subscribe to router events to check the current route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        const token = localStorage.getItem('token');


        // Show the navbar only if the token exists and the route is not login/register
        this.showNavbar =
          !!token &&
          !(
            currentRoute.includes('login') || currentRoute.includes('register')
          );

        console.log('Show Navbar:', this.showNavbar);
      }
    });
  }
}
