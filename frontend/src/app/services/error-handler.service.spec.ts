import { TestBed, inject } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { GlobalErrorHandler } from './error-handler.service';
import { NotificationService } from './notification.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let notificationService: NotificationService;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        {
          provide: NotificationService,
          useValue: {
            showError: jasmine.createSpy('showError')
          }
        },
        {
          provide: Injector,
          useValue: {
            get: (token: any) => {
              if (token === NotificationService) {
                return TestBed.inject(NotificationService);
              }
              return undefined;
            }
          }
        }
      ]
    });
    handler = TestBed.inject(GlobalErrorHandler);
    notificationService = TestBed.inject(NotificationService);
    injector = TestBed.inject(Injector);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('should handle HttpErrorResponse and show error notification', () => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: '/api/data' });
    spyOn(console, 'error'); // Spy on console.error to prevent actual logging during test

    handler.handleError(error);

    expect(notificationService.showError).toHaveBeenCalledWith('Server Error: 404 - Http failure response for /api/data: 404 Not Found');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle generic Error and show error notification', () => {
    const error = new Error('Client-side error');
    spyOn(console, 'error');

    handler.handleError(error);

    expect(notificationService.showError).toHaveBeenCalledWith('Client Error: Client-side error');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle unknown errors and show generic error notification', () => {
    const error = 'Just a string error';
    spyOn(console, 'error');

    handler.handleError(error);

    expect(notificationService.showError).toHaveBeenCalledWith('An unexpected error occurred.');
    expect(console.error).toHaveBeenCalled();
  });
});