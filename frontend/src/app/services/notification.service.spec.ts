import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar);
    spyOn(snackBar, 'open').and.callThrough(); // Spy on the open method
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open with correct parameters for showSuccess', () => {
    service.showSuccess('Success message');
    expect(snackBar.open).toHaveBeenCalledWith('Success message', 'Dismiss', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  });

  it('should call snackBar.open with correct parameters for showError', () => {
    service.showError('Error message');
    expect(snackBar.open).toHaveBeenCalledWith('Error message', 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  });

  it('should call snackBar.open with correct parameters for showWarning', () => {
    service.showWarning('Warning message');
    expect(snackBar.open).toHaveBeenCalledWith('Warning message', 'Dismiss', {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
  });

  it('should call snackBar.open with correct parameters for showInfo', () => {
    service.showInfo('Info message');
    expect(snackBar.open).toHaveBeenCalledWith('Info message', 'Dismiss', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  });
});