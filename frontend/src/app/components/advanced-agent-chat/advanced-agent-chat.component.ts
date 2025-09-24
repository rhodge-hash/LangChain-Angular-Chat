import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvancedAgentService } from '../../services/advanced-agent.service';
import { v4 as uuidv4 } from 'uuid';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NotificationService } from '../../services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-advanced-agent-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './advanced-agent-chat.component.html',
  styleUrl: './advanced-agent-chat.component.css'
})
export class AdvancedAgentChatComponent implements OnInit {
  prompt: string = '';
  response: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  sessionId: string = '';
  intermediateSteps: any[] = [];

  constructor(
    private advancedAgentService: AdvancedAgentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.sessionId = uuidv4();
  }

  async onSubmit() {
    this.errorMessage = '';
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      this.notificationService.showWarning('Prompt cannot be empty.');
      return;
    }
    if (!this.sessionId) {
      this.errorMessage = 'Session ID is missing. Please refresh.';
      this.notificationService.showError('Session ID is missing. Please refresh.');
      return;
    }

    this.isLoading = true;
    this.response = '';
    this.intermediateSteps = [];

    this.advancedAgentService.processAdvancedPrompt(this.prompt, this.sessionId).subscribe({
      next: (data) => {
        this.response = data.output;
        this.intermediateSteps = data.intermediateSteps || [];
        this.isLoading = false;
        this.notificationService.showSuccess('Agent response received!');
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = err.error?.error || 'An unexpected error occurred.';
        this.isLoading = false;
        this.notificationService.showError(this.errorMessage);
      }
    });
  }

  generateNewSessionId() {
    this.sessionId = uuidv4();
    this.response = '';
    this.errorMessage = '';
    this.intermediateSteps = [];
    this.prompt = '';
    this.notificationService.showInfo('New session started.');
  }
}
