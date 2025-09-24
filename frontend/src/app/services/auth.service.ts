import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from './notification.service';

interface AuthResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Adjust if your backend URL is different
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;
  private refreshTokenSubject: BehaviorSubject<string | null>;
  private jwtHelper: JwtHelperService;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.jwtHelper = new JwtHelperService();
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('accessToken'));
    this.token = this.tokenSubject.asObservable();
    this.refreshTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('refreshToken'));
  }

  public get accessTokenValue(): string | null {
    return this.tokenSubject.value;
  }

  public get refreshTokenValue(): string | null {
    return this.refreshTokenSubject.value;
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((res: any) => {
        this.notificationService.showSuccess(res.message || 'Registration successful!');
      }),
      catchError(error => {
        this.notificationService.showError(error.error?.error || 'Registration failed.');
        return throwError(error);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.tokenSubject.next(res.token);
        this.refreshTokenSubject.next(res.refreshToken);
        this.notificationService.showSuccess('Login successful!');
      }),
      catchError(error => {
        this.notificationService.showError(error.error?.error || 'Login failed.');
        return throwError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.router.navigate(['/login']);
    this.notificationService.showInfo('You have been logged out.');
  }

  isLoggedIn(): boolean {
    const token = this.accessTokenValue;
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  hasRole(requiredRoles: string[]): boolean {
    const token = this.accessTokenValue;
    if (!token) {
      return false;
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    if (!decodedToken || !decodedToken.roles) {
      return false;
    }
    const userRoles: string[] = decodedToken.roles;
    return requiredRoles.some(role => userRoles.includes(role));
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.refreshTokenValue;
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.token);
        this.tokenSubject.next(res.token);
      }),
      catchError(error => {
        this.logout();
        this.notificationService.showError('Session expired. Please log in again.');
        return throwError(error);
      })
    );
  }
}