# Tasks: Real-time Communication

**Input**: Design documents from `/specs/005-feature-005-real/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`

## Phase 3.1: Setup
- [x] T001 Set Up WebSocket Server and Routes. Configure the Express.js backend to support WebSockets using the ws library. This involves setting up the WebSocket server and defining the event handlers for incoming connections and messages.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T002 [P] Contract test for WebSocket connection establishment in `backend/tests/contract/websocket.test.js`.
- [x] T003 [P] Contract test for receiving streamed agent responses in `backend/tests/contract/websocket.test.js`.
- [x] T004 [P] Contract test for handling errors during streaming in `backend/tests/contract/websocket.test.js`.
- [x] T005 [P] Integration test for "Real-time Streaming of Agent Responses" scenario in `frontend/e2e/src/websocket.e2e-spec.ts`.
- [x] T006 [P] Integration test for "Handling Long Agent Responses" scenario in `frontend/e2e/src/websocket.e2e-spec.ts`.
- [x] T007 [P] Integration test for "Graceful Error Handling During Streaming" scenario in `frontend/e2e/src/websocket.e2e-spec.ts`.
- [x] T008 [P] Integration test for "Disconnected WebSocket Connection" scenario in `frontend/e2e/src/websocket.e2e-spec.ts`.

## Phase 3.3: Core Implementation (Backend) (ONLY after tests are failing)
- [x] T009 Implement Agent Response Streaming. Modify the LangChain.js agent's logic to send responses in a streaming fashion (chunk by chunk) over the WebSocket connection instead of a single, batched response.
- [x] T010 Integrate WebSocket with JWT. Modify the WebSocket connection process to securely pass the user's JWT for authentication and authorization, ensuring only authenticated users can initiate a real-time agent session.

## Phase 3.3: Core Implementation (Frontend) (ONLY after tests are failing)
- [x] T011 Implement Frontend WebSocket Client. Develop the Angular service and components required to establish and manage a WebSocket connection to the backend.
- [x] T012 Implement WebSocket Error Handling. Add logic to the Angular frontend to gracefully handle WebSocket disconnection events, connection errors, and server-side errors. The UI should provide clear feedback to the user, such as a "reconnecting" message or an error notification.

## Phase 3.4: Integration
- [x] T013 Integrate WebSocket server with existing Express.js HTTP server.
- [x] T014 Replace existing REST API calls for agent communication with WebSocket messages in frontend components.

## Phase 3.5: Polish
- [x] T015 [P] Write unit tests for `websocket-server.js` (backend) and `websocket.service.ts` (frontend).
- [x] T016 [P] Implement robust error handling and reconnection logic for WebSocket in frontend.
- [ ] T017 [P] Update `README.md` and `CHANGELOG.md` with real-time communication feature details.
- [ ] T018 Stress Test WebSocket Server. Conduct load testing to determine the maximum number of concurrent WebSocket connections the server can reliably support and identify any bottlenecks.

## Dependencies
- Setup (T001) before Tests (T002-T008)
- Tests (T002-T008) before Core Implementation (T009-T012)
- Core Implementation (T009-T012) before Integration (T013-T014)
- Integration (T013-T014) before Polish (T015-T018)

## Parallel Example
```
# Launch T002-T008 together:
Task: "Contract test for WebSocket connection establishment in backend/tests/contract/websocket.test.js"
Task: "Contract test for receiving streamed agent responses in backend/tests/contract/websocket.test.js"
Task: "Contract test for handling errors during streaming in backend/tests/contract/websocket.test.js"
Task: "Integration test for 'Real-time Streaming of Agent Responses' scenario in frontend/e2e/src/websocket.e2e-spec.ts"
Task: "Integration test for 'Handling Long Agent Responses' scenario in frontend/e2e/src/websocket.e2e-spec.ts"
Task: "Integration test for 'Graceful Error Handling During Streaming' scenario in frontend/e2e/src/websocket.e2e-spec.ts"
Task: "Integration test for 'Disconnected WebSocket Connection' scenario in frontend/e2e/src/websocket.e2e-spec.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
