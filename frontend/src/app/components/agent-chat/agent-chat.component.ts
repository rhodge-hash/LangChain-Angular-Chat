import { Component } from '@angular/core';
import { AgentService } from '../../services/agent.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-chat.component.html',
  styleUrl: './agent-chat.component.css'
})
export class AgentChatComponent {
  prompt: string = '';
  response: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private agentService: AgentService) { }

  async onSubmit() {
    this.errorMessage = '';
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      return;
    }

    this.isLoading = true;
    this.response = '';

    this.agentService.processPrompt(this.prompt).subscribe({
      next: (data) => {
        this.response = data.response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = err.error?.error || 'An unexpected error occurred.';
        this.isLoading = false;
      }
    });
  }
}
