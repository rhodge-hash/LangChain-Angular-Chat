import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvancedAgentService } from '../../services/advanced-agent.service';
import { v4 as uuidv4 } from 'uuid'; // For generating unique session IDs

@Component({
  selector: 'app-advanced-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private advancedAgentService: AdvancedAgentService) { }

  ngOnInit(): void {
    this.sessionId = uuidv4(); // Generate a new session ID on component initialization
  }

  async onSubmit() {
    this.errorMessage = '';
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      return;
    }
    if (!this.sessionId) {
      this.errorMessage = 'Session ID is missing. Please refresh.';
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
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = err.error?.error || 'An unexpected error occurred.';
        this.isLoading = false;
      }
    });
  }

  // Method to generate a new session ID
  generateNewSessionId() {
    this.sessionId = uuidv4();
    this.response = '';
    this.errorMessage = '';
    this.intermediateSteps = [];
    this.prompt = '';
    this.showStatus('New session started.', 'info');
  }

  showStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
    // This is a placeholder for a more robust status display
    console.log(`Status (${type}): ${message}`);
  }
}
