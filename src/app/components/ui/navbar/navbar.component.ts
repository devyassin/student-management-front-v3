import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

interface NavRoute {
  path: string;
  label: string;
  exact?: boolean;
  roles: string[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, NgbCollapseModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  currentUser: User | null = null;
  routes: NavRoute[] = [
    {
      path: '/dashboard/students',
      label: 'Students',
      roles: ['ADMIN', 'SCOLARITE'],
      exact: true,
    },
    {
      path: '/dashboard/grades',
      label: 'Grades',
      roles: ['ADMIN', 'SCOLARITE', 'STUDENT'],
    },
    {
      path: '/dashboard/courses',
      roles: ['ADMIN', 'SCOLARITE', 'STUDENT'],
      label: 'Courses',
    },
    { path: '/dashboard/accounts', roles: ['ADMIN'], label: 'Accounts' },
    {
      path: '/dashboard/stats',
      roles: ['ADMIN', 'SCOLARITE', 'STUDENT'],
      label: 'Stats',
    },
  ];

  filteredRoutes: NavRoute[] = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.loadUserProfile();
  }

  async logout() {
    const result = await Swal.fire({
      title: 'Are you sure u want to logout?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, log out !',
    });

    if (result.isConfirmed) {
      Swal.fire('Logout!', 'U have been logout.', 'success');

      localStorage.removeItem('token');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.filterRoutes();
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  filterRoutes(): void {
    if (this.currentUser) {
      this.filteredRoutes = this.routes.filter((route) =>
        route.roles.some((role) => this.currentUser!.roles.includes(role))
      );
    }
  }
}
