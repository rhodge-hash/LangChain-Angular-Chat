import 'dotenv/config'; // This loads environment variables from .env
import app from './app.js';
import http from 'http'; // Import http module
import { WebSocketServer } from 'ws'; // Import WebSocketServer
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for WebSocket auth

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app); // Create an HTTP server and pass the Express app
const wss = new WebSocketServer({
  server,
  verifyClient: (info, done) => { // Add verifyClient for JWT authentication
    const token = info.req.headers['sec-websocket-protocol']; // Assuming token is passed in Sec-WebSocket-Protocol header
    if (!token) {
      return done(false, 401, 'Unauthorized: No token provided');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return done(false, 403, 'Forbidden: Invalid or expired token');
      }
      info.req.user = user; // Attach user payload to the request for WebSocket handlers
      done(true);
    });
  }
});

wss.on('connection', (ws, req) => { // req contains user from verifyClient
  console.log('WebSocket client connected:', req.user.email);
  ws.user = req.user; // Attach user to WebSocket instance

  ws.on('message', message => {
    console.log(`Received message from ${ws.user.email}: ${message}`);
    // Handle incoming WebSocket messages here
    // For now, just echo back
    ws.send(`Echo from ${ws.user.email}: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected:', ws.user.email);
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => { // Listen on the HTTP server
  console.log(`Backend server running on port ${PORT}`);
  console.log(`WebSocket server also running on port ${PORT}`);
});