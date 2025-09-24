import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  showSuccess(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  showWarning(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
  }

  showInfo(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}