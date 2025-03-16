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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
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
        this.toastr.success('Welcome!');
        // this.router.navigate(['/dashboard/upload']);
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
