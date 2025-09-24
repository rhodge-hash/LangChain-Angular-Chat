import { WebSocketServer } from 'ws';
import http from 'http';
import { setupWebSocketServer } from '../../src/websocket-server.js'; // Assuming this is where setupWebSocketServer is
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('WebSocket Server Setup', () => {
  let server;
  let wss;
  let mockApp;

  beforeEach(() => {
    mockApp = jest.fn(); // Mock Express app
    server = http.createServer(mockApp);
    wss = new WebSocketServer({ server }); // Create a real WebSocketServer instance
    jest.spyOn(wss, 'on'); // Spy on wss.on to check event handlers

    // Clear mocks and reset environment variables
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  afterEach((done) => {
    server.close(done);
  });

  it('should set up WebSocket server and attach to HTTP server', (done) => {
    setupWebSocketServer(server); // Call the setup function

    // Verify that the 'connection' event handler is set
    expect(wss.on).toHaveBeenCalledWith('connection', expect.any(Function));

    // Simulate a client connection to trigger the 'connection' event
    const clientWs = new WebSocket(`ws://localhost:${server.address().port}`);
    clientWs.onopen = () => {
      clientWs.close();
      done();
    };
  });

  describe('WebSocket Authentication', () => {
    it('should allow connection with a valid JWT', (done) => {
      const mockToken = 'valid.jwt.token';
      const mockUser = { id: 1, email: 'test@example.com' };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockUser);
      });

      const clientWs = new WebSocket(`ws://localhost:${server.address().port}`, mockToken);

      clientWs.onopen = () => {
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test_secret', expect.any(Function));
        clientWs.close();
        done();
      };

      clientWs.onerror = (err) => {
        done(err);
      };
    });

    it('should deny connection without a token', (done) => {
      const clientWs = new WebSocket(`ws://localhost:${server.address().port}`);

      clientWs.onclose = (event) => {
        expect(event.code).toBe(1008); // Policy Violation
        expect(event.reason).toContain('Unauthorized: No token provided');
        done();
      };

      clientWs.onerror = (err) => {
        // This might be triggered by the server closing the connection
        // We expect onclose to handle the specific reason
      };
    });

    it('should deny connection with an invalid token', (done) => {
      const mockToken = 'invalid.jwt.token';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      const clientWs = new WebSocket(`ws://localhost:${server.address().port}`, mockToken);

      clientWs.onclose = (event) => {
        expect(event.code).toBe(1008); // Policy Violation
        expect(event.reason).toContain('Forbidden: Invalid or expired token');
        done();
      };

      clientWs.onerror = (err) => {
        // This might be triggered by the server closing the connection
        // We expect onclose to handle the specific reason
      };
    });
  });
});