import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export interface WebSocketMessage {
  type: 'prompt' | 'start' | 'chunk' | 'end' | 'error';
  prompt?: string;
  sessionId: string;
  content?: string;
  timestamp?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private messagesSubject: Subject<WebSocketMessage>;
  public messages: Observable<WebSocketMessage>;
  private connectionStatusSubject: BehaviorSubject<boolean>;
  public connectionStatus: Observable<boolean>;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.messagesSubject = new Subject<WebSocketMessage>();
    this.messages = this.messagesSubject.asObservable();
    this.connectionStatusSubject = new BehaviorSubject<boolean>(false);
    this.connectionStatus = this.connectionStatusSubject.asObservable();
  }

  public connect(sessionId: string): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting.');
      return;
    }

    const accessToken = this.authService.accessTokenValue;
    if (!accessToken) {
      this.notificationService.showError('Authentication token missing. Please log in.');
      return;
    }

    // Pass token in Sec-WebSocket-Protocol header for backend verification
    this.ws = new WebSocket(`ws://localhost:3000/ws/agent`, accessToken);

    this.ws.onopen = () => {
      console.log('WebSocket connected.');
      this.connectionStatusSubject.next(true);
      this.reconnectAttempts = 0;
      this.notificationService.showInfo('Real-time connection established.');
    };

    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.messagesSubject.next(message);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.connectionStatusSubject.next(false);
      this.notificationService.showWarning('Real-time connection lost. Attempting to reconnect...');
      this.attemptReconnect(sessionId);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notificationService.showError('Real-time connection error. Attempting to reconnect...');
      this.ws?.close(); // Close to trigger onclose and reconnect logic
    };
  }

  public disconnect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
      this.notificationService.showInfo('Real-time connection closed.');
    }
  }

  public sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.notificationService.showError('WebSocket is not connected. Please try again.');
    }
  }

  private attemptReconnect(sessionId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... Attempt ${this.reconnectAttempts}`);
        this.connect(sessionId);
      }, this.reconnectInterval);
    } else {
      this.notificationService.showError('Failed to re-establish real-time connection after multiple attempts. Please refresh the page.');
    }
  }
}