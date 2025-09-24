# Changelog

## 0.5.0 - 2025-09-24

### Added
- **Feature 005: Real-time Communication**: Implemented real-time, streaming communication between frontend and backend using WebSockets.
  - Configured Express.js backend to handle WebSocket connections.
  - Modified LangChain.js agent logic to stream responses in chunks over WebSocket.
  - Implemented frontend WebSocket client (`WebsocketService`) for connection management and message handling.
  - Modified agent chat components to use WebSocket for sending prompts and receiving streamed responses.
  - Implemented progressive display of streamed responses in frontend chat components.
  - Implemented WebSocket error handling and reconnection logic in the frontend.
  - Integrated JWT authentication with WebSocket connections for secure communication.
  - Unit tests for backend WebSocket server and frontend WebSocket service.
  - Contract tests for WebSocket communication.
  - Integration tests for frontend WebSocket scenarios.

### Changed
- Updated `README.md` to reflect the new real-time communication feature and mention the `ws` library.
- Modified `backend/src/main.js` to set up and integrate the WebSocket server.
- Modified `backend/src/services/agent.service.js` and `backend/src/services/advanced-agent.service.js` to stream responses over WebSocket.
- Modified `frontend/src/app/components/agent-chat/agent-chat.component.ts` and `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.ts` to use `WebsocketService`.
- Created `frontend/src/app/services/websocket.service.ts`.
- Created unit tests for `WebsocketService` and contract tests for WebSocket communication.

### Removed
- (No removals in this version)

## 0.4.0 - 2025-09-24

### Added
- **Feature 004: User Authentication and Session Management**: Implemented a secure JWT-based authentication system.
  - Backend Express.js routes for user registration (`/api/auth/register`), login (`/api/auth/login`), and token refresh (`/api/auth/refresh-token`).
  - User entity with Email, Hashed Password, and Roles (in-memory store for prototype).
  - Password hashing and salting using `bcryptjs`.
  - JWT generation and validation using `jsonwebtoken`.
  - Rate limiting middleware (`express-rate-limit`) applied to authentication routes.
  - JWT authentication middleware to protect backend API endpoints.
  - Frontend Angular components for user login and registration.
  - Frontend `AuthService` for authentication logic, token management (stored in `localStorage`), and silent token refresh.
  - JWT interceptor (`JwtInterceptor`) to attach tokens to outgoing requests.
  - Route guards (`AuthGuard`) to protect frontend routes based on authentication status and roles.
  - Unit tests for backend `auth.service.js` and frontend `auth.service.ts`.
  - Contract tests for backend authentication API endpoints.
  - Integration tests for frontend authentication scenarios.

### Changed
- Updated `README.md` to reflect the new authentication feature and related technologies.
- Modified `backend/src/app.js` to include authentication routes and apply JWT authentication middleware to protected routes.
- Modified `frontend/src/app/app.component.ts` and `app.component.html` to conditionally display navigation based on authentication status.
- Updated `frontend/src/app/app.config.ts` to register `JwtInterceptor`.

### Removed
- (No removals in this version)

## 0.3.0 - 2025-09-24

### Added
- **Feature 003: Enhanced Frontend UI/UX**: Implemented a modern, responsive, and intuitive Angular frontend.
  - Integrated Angular Material for consistent styling and components.
  - Implemented minimalist dark mode design.
  - Added real-time feedback mechanisms: loading spinners, progress bars, and informative toast notifications.
  - Enhanced error handling with a global error handler and user-friendly notifications.
  - Refactored `agent-chat` and `advanced-agent-chat` components to utilize the new design system.

### Changed
- Updated `README.md` to reflect the new UI/UX enhancements and mention Angular Material.
- Modified `frontend/src/app/app.component.html` and `frontend/src/app/app.component.ts` for base UI layout with Angular Material.
- Updated `frontend/src/app/app.config.ts` to include `provideAnimations()` and register `GlobalErrorHandler`.
- Modified `frontend/src/styles.css` and `frontend/src/app/app.css` for global theming and responsive design.
- Updated `frontend/e2e/src/enhanced-ui.e2e-spec.ts` and `frontend/e2e/src/enhanced-ui.po.ts` for integration tests.
- Modified `frontend/src/app/components/agent-chat/agent-chat.component.html` and `frontend/src/app/components/agent-chat/agent-chat.component.ts` to include Material spinners and `NotificationService`.
- Modified `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.html` and `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.ts` to include Material components and `NotificationService`.
- Created `frontend/src/app/services/notification.service.ts` and `frontend/src/app/services/error-handler.service.ts`.
- Created unit tests for `NotificationService` and `GlobalErrorHandler`.

### Removed
- (No removals in this version)

## 0.2.0 - 2025-09-24

### Added
- **Feature 002: Sophisticated LangChain.js Agents**: Implemented advanced LangChain.js agents with conversational memory, complex reasoning, and integration of search, calculator, and file system tools.
  - New backend API endpoint: `POST /api/advanced-agent-chat` for interacting with sophisticated agents.
  - New Angular component (`AdvancedAgentChatComponent`) for advanced agent interaction.
  - New backend service (`advanced-agent.service.js`) and route (`advanced-agent.js`) for the sophisticated agent.
  - New frontend service (`advanced-agent.service.ts`) and component (`advanced-agent-chat`) for the sophisticated agent.
  - Added unit and E2E tests for the sophisticated agent feature.

### Changed
- Updated `README.md` to reflect the new sophisticated agent feature, API endpoints, and updated project structure.
- Updated `quickstart.md` for Feature 002 with setup and verification steps for the sophisticated agent.
- Modified backend to use ES module syntax consistently.
- Configured Jest for backend to support ES modules.

### Removed
- (No removals in this version)

## 0.1.0 - 2025-09-24

### Added
- Initial implementation of LangChain.js Agent with Angular Frontend.
- Backend Express.js server with LangChain.js agent for prompt processing.
- Angular frontend for interactive chat with the agent.
- Basic setup for ESLint, Prettier, Jest, and Cypress.
- **Blog Post Generation Feature**: Integrated a LangChain.js agent for generating blog posts based on user-provided topics.
  - New backend API endpoints: `POST /api/generate-blog-post` and `GET /api/blog-posts`.
  - New Angular component (`BlogGeneratorComponent`) to interact with the blog generation feature.

### Changed
- Updated `README.md` to reflect the new blog generation feature, API endpoints, and updated setup instructions.
- Modified backend to use ES module syntax consistently.
- Configured Angular proxy for seamless frontend-backend communication.

### Removed
- `goal.txt` (removed from remote repository).

---
*Generated by Gemini CLI Agent on September 24, 2025*