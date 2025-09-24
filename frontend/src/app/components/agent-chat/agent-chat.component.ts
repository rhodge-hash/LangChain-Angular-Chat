import { Component } from '@angular/core';
import { AgentService } from '../../services/agent.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NotificationService } from '../../services/notification.service'; // Import NotificationService
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule for NotificationService

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, MatProgressBarModule, MatSnackBarModule], // Add MatSnackBarModule
  templateUrl: './agent-chat.component.html',
  styleUrl: './agent-chat.component.css'
})
export class AgentChatComponent {
  prompt: string = '';
  response: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private agentService: AgentService,
    private notificationService: NotificationService // Inject NotificationService
  ) { }

  async onSubmit() {
    this.errorMessage = '';
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      this.notificationService.showWarning('Prompt cannot be empty.'); // Show warning
      return;
    }

    this.isLoading = true;
    this.response = '';

    this.agentService.processPrompt(this.prompt).subscribe({
      next: (data) => {
        this.response = data.response;
        this.isLoading = false;
        this.notificationService.showSuccess('Agent response received!'); // Show success
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = err.error?.error || 'An unexpected error occurred.';
        this.isLoading = false;
        this.notificationService.showError(this.errorMessage); // Show error
      }
    });
  }
}
