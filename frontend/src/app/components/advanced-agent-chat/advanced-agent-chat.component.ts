import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
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
import { WebsocketService, WebSocketMessage } from '../../services/websocket.service'; // Import WebsocketService

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
export class AdvancedAgentChatComponent implements OnInit, OnDestroy { // Implement OnDestroy
  prompt: string = '';
  response: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  sessionId: string = '';
  intermediateSteps: any[] = [];

  constructor(
    private advancedAgentService: AdvancedAgentService, // Keep for other potential REST calls if needed, or remove if fully replaced
    private notificationService: NotificationService,
    private websocketService: WebsocketService // Inject WebsocketService
  ) { }

  ngOnInit(): void {
    this.sessionId = uuidv4();
    this.websocketService.connect(this.sessionId);
    this.websocketService.messages.subscribe(message => {
      this.handleWebSocketMessage(message);
    });
    this.websocketService.connectionStatus.subscribe(status => {
      if (!status) {
        this.notificationService.showWarning('WebSocket disconnected. Attempting to reconnect...');
      }
    });
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
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

    const message: WebSocketMessage = {
      type: 'prompt',
      prompt: this.prompt,
      sessionId: this.sessionId
    };
    this.websocketService.sendMessage(message);
    this.prompt = ''; // Clear prompt after sending
  }

  generateNewSessionId() {
    this.sessionId = uuidv4();
    this.response = '';
    this.errorMessage = '';
    this.intermediateSteps = [];
    this.prompt = '';
    this.notificationService.showInfo('New session started.');
  }

  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'start':
        this.response = ''; // Clear previous response
        this.isLoading = true;
        break;
      case 'chunk':
        this.response += message.content; // Append streamed content
        break;
      case 'end':
        this.isLoading = false;
        this.notificationService.showSuccess('Agent response received!');
        break;
      case 'error':
        this.isLoading = false;
        this.errorMessage = message.error || 'An error occurred during streaming.';
        this.notificationService.showError(this.errorMessage);
        break;
    }
  }
}
