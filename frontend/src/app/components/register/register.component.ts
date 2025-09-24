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
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  @ViewChild('registerForm') registerForm!: NgForm;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.notificationService.showWarning('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']); // Redirect to login after successful registration
      },
      error: (err) => {
        this.isLoading = false;
        // Error message handled by authService
      }
    });
  }
}