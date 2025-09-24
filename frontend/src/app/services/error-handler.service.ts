import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any): void {
    const notificationService = this.injector.get(NotificationService);

    let message: string;
    let stackTrace: string;

    if (error instanceof HttpErrorResponse) {
      // Server error
      message = `Backend returned code ${error.status}: ${error.message}`;
      stackTrace = error.error?.stack || error.stack;
      notificationService.showError(`Server Error: ${error.status} - ${error.message}`);
    } else if (error instanceof Error) {
      // Client error
      message = `An error occurred: ${error.message}`;
      stackTrace = error.stack;
      notificationService.showError(`Client Error: ${error.message}`);
    } else {
      // Unknown error
      message = 'An unexpected error occurred.';
      stackTrace = error ? error.toString() : 'No stack trace available.';
      notificationService.showError('An unexpected error occurred.');
    }

    console.error('Global Error Handler:', message, stackTrace);
    // Log the error to a remote logging service in a real application
  }
}