import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser: User | null = this.authService.getUser(); 

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles: string[] = route.data['roles'];
    if (
      !requiredRoles ||
      requiredRoles.some((role) => currentUser.roles.includes(role))
    ) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
