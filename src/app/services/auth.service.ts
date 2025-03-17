import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = `${environment.API_STD}/users`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          this.setAuthToken(token);
          this.loadUserProfile();
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || 'Login failed')
          );
        })
      );
  }

  private setAuthToken(token: string) {
    localStorage.setItem('token', token);
  }

  register(credentials: RegisterCredentials): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.API_URL}/register`, credentials)
      .pipe(
        tap((response) => {}),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || 'Registration failed')
          );
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      tap((user: User) => {
        console.log('Profile retrieved:', user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError((error) =>
        throwError(
          () => new Error(error.error?.message || 'Failed to get profile')
        )
      )
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.API_URL}/logout`, {})
      .pipe(
        tap((response: { message: string }) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || 'Logout failed')
          );
        })
      );
  }

  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  loadUserProfile(): void {
    this.getProfile().subscribe();
  }
}
