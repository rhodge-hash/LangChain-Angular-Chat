import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;
  let notificationService: NotificationService;
  let jwtHelper: JwtHelperService;

  const mockAuthResponse = {
    token: 'mockAccessToken',
    refreshToken: 'mockRefreshToken'
  };

  const mockDecodedToken = {
    id: 1,
    email: 'test@example.com',
    roles: ['user'],
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour from now
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        },
        {
          provide: NotificationService,
          useValue: {
            showSuccess: jasmine.createSpy('showSuccess'),
            showError: jasmine.createSpy('showError'),
            showWarning: jasmine.createSpy('showWarning'),
            showInfo: jasmine.createSpy('showInfo')
          }
        },
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: {} } // Provide empty JWT_OPTIONS
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    notificationService = TestBed.inject(NotificationService);
    jwtHelper = TestBed.inject(JwtHelperService);

    // Mock localStorage
    let store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value + '');
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => { delete store[key]; });
    spyOn(localStorage, 'clear').and.callFake(() => { store = {}; });

    spyOn(jwtHelper, 'decodeToken').and.returnValue(mockDecodedToken);
    spyOn(jwtHelper, 'isTokenExpired').and.returnValue(false);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a user successfully', () => {
      const mockResponse = { message: 'Registration successful!' };
      service.register('test@example.com', 'password123').subscribe(res => {
        expect(res).toEqual(mockResponse);
        expect(notificationService.showSuccess).toHaveBeenCalledWith('Registration successful!');
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/auth/register');
      expect(req.request.method).toEqual('POST');
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const mockError = { error: { error: 'User already exists' } };
      service.register('test@example.com', 'password123').subscribe({
        error: err => {
          expect(err.error).toEqual(mockError.error);
          expect(notificationService.showError).toHaveBeenCalledWith('User already exists');
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/auth/register');
      expect(req.request.method).toEqual('POST');
      req.error(new ErrorEvent('network error'), { status: 400, statusText: 'Bad Request', error: mockError.error });
    });
  });

  describe('login', () => {
    it('should log in a user and store tokens', () => {
      service.login('test@example.com', 'password123').subscribe(res => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', mockAuthResponse.token);
        expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', mockAuthResponse.refreshToken);
        expect(service.accessTokenValue).toEqual(mockAuthResponse.token);
        expect(service.refreshTokenValue).toEqual(mockAuthResponse.refreshToken);
        expect(notificationService.showSuccess).toHaveBeenCalledWith('Login successful!');
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/auth/login');
      expect(req.request.method).toEqual('POST');
      req.flush(mockAuthResponse);
    });

    it('should handle login error', () => {
      const mockError = { error: { error: 'Invalid credentials' } };
      service.login('test@example.com', 'wrongpassword').subscribe({
        error: err => {
          expect(err.error).toEqual(mockError.error);
          expect(notificationService.showError).toHaveBeenCalledWith('Invalid credentials');
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/auth/login');
      expect(req.request.method).toEqual('POST');
      req.error(new ErrorEvent('network error'), { status: 401, statusText: 'Unauthorized', error: mockError.error });
    });
  });

  describe('logout', () => {
    it('should clear tokens and navigate to login', () => {
      localStorage.setItem('accessToken', 'someToken');
      localStorage.setItem('refreshToken', 'someRefreshToken');
      service.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(service.accessTokenValue).toBeNull();
      expect(service.refreshTokenValue).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(notificationService.showInfo).toHaveBeenCalledWith('You have been logged out.');
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token is valid and not expired', () => {
      localStorage.setItem('accessToken', 'validToken');
      expect(service.isLoggedIn()).toBeTrue();
      expect(jwtHelper.isTokenExpired).toHaveBeenCalledWith('validToken');
    });

    it('should return false if no token', () => {
      localStorage.removeItem('accessToken');
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false if token is expired', () => {
      localStorage.setItem('accessToken', 'expiredToken');
      (jwtHelper.isTokenExpired as jasmine.Spy).and.returnValue(true);
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('hasRole', () => {
    it('should return true if user has required role', () => {
      localStorage.setItem('accessToken', 'tokenWithUserRole');
      (jwtHelper.decodeToken as jasmine.Spy).and.returnValue({ roles: ['user', 'admin'] });
      expect(service.hasRole(['user'])).toBeTrue();
    });

    it('should return false if user does not have required role', () => {
      localStorage.setItem('accessToken', 'tokenWithUserRole');
      (jwtHelper.decodeToken as jasmine.Spy).and.returnValue({ roles: ['user'] });
      expect(service.hasRole(['admin'])).toBeFalse();
    });

    it('should return false if no token', () => {
      localStorage.removeItem('accessToken');
      expect(service.hasRole(['user'])).toBeFalse();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      localStorage.setItem('refreshToken', 'validRefreshToken');
      service.refreshToken().subscribe(res => {
        expect(res).toEqual({ token: 'newAccessToken' });
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'newAccessToken');
        expect(service.accessTokenValue).toEqual('newAccessToken');
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/auth/refresh-token');
      expect(req.request.method).toEqual('POST');
      req.flush({ token: 'newAccessToken' });
    });

    it('should logout if no refresh token', () => {
      localStorage.removeItem('refreshToken');
      service.refreshToken().subscribe({
        error: err => {
          expect(err).toEqual('No refresh token available');
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          expect(notificationService.showInfo).toHaveBeenCalledWith('You have been logged out.');
        }
      });
    });

    it('should logout and show error if refresh token fails', () => {
      localStorage.setItem('refreshToken', 'invalidRefreshToken');
      service.refreshToken().subscribe({
        error: err => {
          expect(err.error).toEqual({ error: 'Invalid or expired refresh token' });
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          expect(notificationService.showError).toHaveBeenCalledWith('Session expired. Please log in again.');
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/auth/refresh-token');
      expect(req.request.method).toEqual('POST');
      req.error(new ErrorEvent('network error'), { status: 401, statusText: 'Unauthorized', error: { error: 'Invalid or expired refresh token' } });
    });
  });
});