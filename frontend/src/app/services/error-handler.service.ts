import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any): void {
    const notificationService = this.injector.get(NotificationService);

    let message: string;
    let stackTrace: string | undefined; // Allow undefined

    if (error instanceof HttpErrorResponse) {
      // Server error
      message = `Backend returned code ${error.status}: ${error.message}`;
      // Try to get stack from error.error if it's an object with a stack, otherwise from error.message
      stackTrace = (error.error && typeof error.error === 'object' && error.error.stack) ? error.error.stack : error.message;
      notificationService.showError(`Server Error: ${error.status} - ${error.message}`);
    } else if (error instanceof Error) {
      // Client error
      message = `An error occurred: ${error.message}`;
      stackTrace = error.stack;
      notificationService.showError(`Client Error: ${error.message}`);
    } else {
      // Unknown error
      message = 'An unexpected error occurred.';
      stackTrace = error ? error.toString() : undefined; // Assign undefined if no stack
      notificationService.showError('An unexpected error occurred.');
    }

    console.error('Global Error Handler:', message, stackTrace || 'No stack trace available.'); // Handle undefined stackTrace    // Log the error to a remote logging service in a real application
  }
}