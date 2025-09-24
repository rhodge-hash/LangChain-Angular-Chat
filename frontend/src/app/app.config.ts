import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; // Import HTTP_INTERCEPTORS and withInterceptorsFromDi
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './services/error-handler.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor'; // Import JwtInterceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Add withInterceptorsFromDi()
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true } // Register JwtInterceptor
  ]
};
