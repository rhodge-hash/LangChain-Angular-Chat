import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.accessTokenValue;
    const isLoggedIn = accessToken && this.authService.isLoggedIn();
    const isApiUrl = request.url.startsWith('http://localhost:3000/api'); // Adjust API URL as needed

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(request);
  }
}