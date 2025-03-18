import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from '../../../shared/buttons/app-loading-button/app-loading-button.component';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formData = { email: '', password: '' };
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    if (!this.formData.email || !this.formData.password) {
      alert('Please fill in all fields.');
      return;
    }
    this.toastr.info('login ...', 'Login');
    this.authService.login(this.formData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        const user: User | null = this.authService.getUser();

        if (user?.roles.includes('ADMIN')) {
          console.log('ffffff');
          this.router.navigate(['/dashboard/accounts']);
        } else if (user?.roles.includes('SCOLARITE')) {
          this.router.navigate(['/dashboard/students']);
        } else {
          this.router.navigate(['/dashboard/grades']);
        }

        this.toastr.success('Welcome!');
        this.router.navigate(['/dashboard/grades']);
      },
      error: (err) => {
        this.toastr.error('Login Faild !');
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
