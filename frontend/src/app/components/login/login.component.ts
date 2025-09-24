import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  @ViewChild('loginForm') loginForm!: NgForm;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']); // Redirect to home if already logged in
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.notificationService.showWarning('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']); // Redirect to home or dashboard
      },
      error: (err) => {
        this.isLoading = false;
        // Error message handled by authService
      }
    });
  }
}