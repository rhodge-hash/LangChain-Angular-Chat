import { TestBed } from '@angular/core/testing';
import { WebsocketService, WebSocketMessage } from './websocket.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Subject } from 'rxjs';

// Mock WebSocket
class MockWebSocket {
  onopen: () => void = () => {};
  onmessage: (event: MessageEvent) => void = () => {};
  onclose: (event: CloseEvent) => void = () => {};
  onerror: (event: Event) => void = () => {};
  readyState: number = WebSocket.CLOSED;
  url: string = '';
  protocol: string = '';

  constructor(url: string, protocol?: string) {
    this.url = url;
    if (protocol) {
      this.protocol = protocol;
    }
    this.readyState = WebSocket.CONNECTING;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen();
    }, 10); // Simulate async connection
  }

  send(data: string) {
    // Simulate receiving a message back
    const message: WebSocketMessage = JSON.parse(data);
    if (message.type === 'prompt' && message.prompt === 'simulate error') {
      this.onerror(new Event('error'));
    } else if (message.type === 'prompt') {
      this.onmessage({ data: JSON.stringify({ type: 'start', sessionId: message.sessionId }) } as MessageEvent);
      this.onmessage({ data: JSON.stringify({ type: 'chunk', sessionId: message.sessionId, content: 'Mocked response chunk.' }) } as MessageEvent);
      this.onmessage({ data: JSON.stringify({ type: 'end', sessionId: message.sessionId }) } as MessageEvent);
    }
  }

  close(code?: number, reason?: string) {
    this.readyState = WebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = WebSocket.CLOSED;
      this.onclose({ code, reason } as CloseEvent);
    }, 10);
  }
}

describe('WebsocketService', () => {
  let service: WebsocketService;
  let authService: AuthService;
  let notificationService: NotificationService;
  let mockWebSocket: MockWebSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebsocketService,
        {
          provide: AuthService,
          useValue: {
            accessTokenValue: 'mockAccessToken',
            isLoggedIn: () => true
          }
        },
        {
          provide: NotificationService,
          useValue: {
            showSuccess: jasmine.createSpy('showSuccess'),
            showError: jasmine.createSpy('showError'),
            showWarning: jasmine.createSpy('showWarning'),
            showInfo: jasmine.createSpy('showInfo')
          }
        }
      ]
    });

    service = TestBed.inject(WebsocketService);
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);

    // Mock the global WebSocket constructor
    (window as any).WebSocket = MockWebSocket;
  });

  afterEach(() => {
    // Restore original WebSocket
    (window as any).WebSocket = WebSocket;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect to WebSocket with token', (done) => {
    service.connect('test-session');
    service.connectionStatus.subscribe(status => {
      if (status === true) {
        expect(notificationService.showInfo).toHaveBeenCalledWith('Real-time connection established.');
        done();
      }
    });
  });

  it('should not connect if already connected', (done) => {
    service.connect('test-session');
    service.connectionStatus.subscribe(status => {
      if (status === true) {
        service.connect('test-session'); // Call connect again
        expect(notificationService.showInfo).toHaveBeenCalledTimes(1); // Should only be called once
        done();
      }
    });
  });

  it('should send messages when connected', (done) => {
    service.connect('test-session');
    service.connectionStatus.subscribe(status => {
      if (status === true) {
        const message: WebSocketMessage = { type: 'prompt', prompt: 'test', sessionId: 'test-session' };
        service.sendMessage(message);
        // In MockWebSocket, sending a prompt triggers a mock response
        service.messages.subscribe(msg => {
          if (msg.type === 'end') {
            expect(msg.sessionId).toEqual('test-session');
            done();
          }
        });
      }
    });
  });

  it('should receive streamed messages', (done) => {
    service.connect('test-session');
    service.messages.subscribe(message => {
      if (message.type === 'chunk') {
        expect(message.content).toEqual('Mocked response chunk.');
        done();
      }
    });
    service.sendMessage({ type: 'prompt', prompt: 'test', sessionId: 'test-session' });
  });

  it('should handle WebSocket errors', (done) => {
    service.connect('test-session');
    service.connectionStatus.subscribe(status => {
      if (status === true) {
        const message: WebSocketMessage = { type: 'prompt', prompt: 'simulate error', sessionId: 'test-session' };
        service.sendMessage(message); // This will trigger onerror in MockWebSocket
        expect(notificationService.showError).toHaveBeenCalledWith('Real-time connection error. Attempting to reconnect...');
        done();
      }
    });
  });

  it('should attempt to reconnect on close', (done) => {
    service.connect('test-session');
    service.connectionStatus.subscribe(status => {
      if (status === true) {
        // Manually close the mock WebSocket to simulate disconnection
        (service as any).ws.close();
        expect(notificationService.showWarning).toHaveBeenCalledWith('Real-time connection lost. Attempting to reconnect...');
        // Expect connect to be called again due to reconnect logic
        setTimeout(() => {
          expect(notificationService.showInfo).toHaveBeenCalledWith('Real-time connection established.'); // Reconnected
          done();
        }, 50); // Allow time for reconnect timeout
      }
    });
  });

  it('should disconnect WebSocket', (done) => {
    service.connect('test-session');
    service.connectionStatus.subscribe(status => {
      if (status === true) {
        service.disconnect();
        expect(notificationService.showInfo).toHaveBeenCalledWith('Real-time connection closed.');
        done();
      }
    });
  });
});