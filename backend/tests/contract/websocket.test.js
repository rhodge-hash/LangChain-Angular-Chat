import WebSocket from 'ws';
import http from 'http';
import app from '../../src/app.js'; // Your Express app
import { setupWebSocketServer } from '../../src/websocket-server.js'; // Assuming this will be your WebSocket setup

describe('WebSocket API Contract Tests', () => {
  let server;
  let wsUrl;

  beforeAll((done) => {
    server = http.createServer(app);
    setupWebSocketServer(server); // Initialize WebSocket server with the http server
    server.listen(0, () => {
      wsUrl = `ws://localhost:${server.address().port}/ws/agent`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should establish a WebSocket connection', (done) => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      expect(ws.readyState).toEqual(WebSocket.OPEN);
      ws.close();
      done();
    };

    ws.onerror = (err) => {
      done(err);
    };
  });

  it('should receive streamed agent responses', (done) => {
    const ws = new WebSocket(wsUrl);
    const testPrompt = 'Hello agent, stream me a response.';
    const sessionId = 'test-session-123';
    let receivedChunks = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'prompt', prompt: testPrompt, sessionId: sessionId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      receivedChunks.push(message);

      if (message.type === 'end') {
        expect(receivedChunks.length).toBeGreaterThan(1); // Should have at least start, chunk(s), end
        expect(receivedChunks[0].type).toEqual('start');
        expect(receivedChunks[receivedChunks.length - 1].type).toEqual('end');
        expect(receivedChunks.every(chunk => chunk.sessionId === sessionId)).toBe(true);
        ws.close();
        done();
      }
    };

    ws.onerror = (err) => {
      done(err);
    };
  }, 10000); // Increase timeout for streaming tests

  it('should handle errors during streaming', (done) => {
    const ws = new WebSocket(wsUrl);
    const errorPrompt = 'Simulate an error during streaming.';
    const sessionId = 'error-session-456';
    let errorReceived = false;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'prompt', prompt: errorPrompt, sessionId: sessionId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'error') {
        expect(message).toHaveProperty('error');
        expect(message.sessionId).toEqual(sessionId);
        errorReceived = true;
        ws.close();
        done();
      }
    };

    ws.onclose = () => {
      if (!errorReceived) {
        done(new Error('Expected error message not received.'));
      }
    };

    ws.onerror = (err) => {
      done(err);
    };
  }, 10000);
});