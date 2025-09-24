# Data Model for Feature 005: Real-time Communication

## Entities

### WebSocket Connection
Represents the persistent, full-duplex communication channel between frontend and backend.

*   **Attributes**:
    *   `id`: String (unique identifier for the connection)
    *   `userId`: String (ID of the authenticated user, if applicable)
    *   `status`: String (e.g., 'connected', 'disconnected', 'error')

### Agent Stream
Represents the real-time flow of partial responses from the LangChain.js agent.

*   **Attributes**:
    *   `sessionId`: String (ID of the conversation session)
    *   `type`: String (e.g., 'start', 'chunk', 'end', 'error')
    *   `content`: String (partial or full agent response)
    *   `timestamp`: Number (time of message generation)