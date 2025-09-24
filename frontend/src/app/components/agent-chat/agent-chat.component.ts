import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnInit, OnDestroy
import { AgentService } from '../../services/agent.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NotificationService } from '../../services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WebsocketService, WebSocketMessage } from '../../services/websocket.service'; // Import WebsocketService
import { v4 as uuidv4 } from 'uuid'; // Import uuid for sessionId

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './agent-chat.component.html',
  styleUrl: './agent-chat.component.css'
})
export class AgentChatComponent implements OnInit, OnDestroy { // Implement OnInit, OnDestroy
  prompt: string = '';
  response: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  sessionId: string = ''; // Add sessionId

  constructor(
    private agentService: AgentService, // Keep for other potential REST calls if needed, or remove if fully replaced
    private notificationService: NotificationService,
    private websocketService: WebsocketService // Inject WebsocketService
  ) { }

  ngOnInit(): void {
    this.sessionId = uuidv4(); // Generate sessionId
    this.websocketService.connect(this.sessionId); // Connect WebSocket
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
    this.websocketService.disconnect(); // Disconnect WebSocket
  }

  async onSubmit() {
    this.errorMessage = '';
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      this.notificationService.showWarning('Prompt cannot be empty.');
      return;
    }

    this.isLoading = true;
    this.response = '';

    const message: WebSocketMessage = {
      type: 'prompt',
      prompt: this.prompt,
      sessionId: this.sessionId
    };
    this.websocketService.sendMessage(message);
    this.prompt = ''; // Clear prompt after sending
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
