# Tasks: User Authentication and Session Management

**Input**: Design documents from `/specs/004-feature-004-user/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`

## Phase 3.1: Setup
- [x] T001 Install backend dependencies: `bcryptjs`, `jsonwebtoken`, `express-rate-limit` in `backend/`.
- [x] T002 Install frontend dependencies: `@angular/jwt` in `frontend/`.
- [x] T003 Configure environment variables for JWT secret and token expiration in `backend/.env`.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test `POST /api/auth/register` in `backend/tests/contract/auth.test.js`.
- [x] T005 [P] Contract test `POST /api/auth/login` in `backend/tests/contract/auth.test.js`.
- [x] T006 [P] Contract test `POST /api/auth/refresh-token` in `backend/tests/contract/auth.test.js`.
- [x] T007 [P] Integration test for "User Registration and Login" scenario in `frontend/e2e/src/auth.e2e-spec.ts`.
- [x] T008 [P] Integration test for "Accessing Protected Functionality" scenario in `frontend/e2e/src/auth.e2e-spec.ts`.
- [x] T009 [P] Integration test for "Silent Token Refresh" scenario in `frontend/e2e/src/auth.e2e-spec.ts`.
- [x] T010 [P] Integration test for "Invalid Credentials and Rate Limiting" scenario in `frontend/e2e/src/auth.e2e-spec.ts`.

## Phase 3.3: Core Implementation (Backend) (ONLY after tests are failing)
- [x] T011 Create `backend/src/models/user.model.js` for User entity (in-memory store).
- [x] T012 Implement password hashing and salting using `bcryptjs` in `backend/src/services/auth.service.js`.
- [x] T013 Implement JWT generation and validation in `backend/src/services/auth.service.js`.
- [x] T014 Create `backend/src/routes/auth.routes.js` for `/api/auth/register` and `/api/auth/login` endpoints.
- [x] T015 Implement rate limiting middleware in `backend/src/middleware/rate-limit.js` and apply to auth routes.
- [x] T016 Implement JWT authentication middleware in `backend/src/middleware/auth.js` to protect routes and validate JWT for each protected API request.
- [x] T017 Implement token refresh logic in `backend/src/routes/auth.routes.js`.

## Phase 3.3: Core Implementation (Frontend) (ONLY after tests are failing)
- [x] T018 Create `frontend/src/app/services/auth.service.ts` for authentication logic (login, register, logout, token management).
- [x] T019 Create `frontend/src/app/components/login/login.component.ts` and `login.component.html` for user login.
- [x] T020 Create `frontend/src/app/components/register/register.component.ts` and `register.component.html` for user registration.
- [x] T021 Implement JWT interceptor in `frontend/src/app/interceptors/jwt.interceptor.ts` to attach tokens to outgoing requests.
- [x] T022 Implement route guards in `frontend/src/app/guards/auth.guard.ts` to protect frontend routes.
- [x] T023 Update `app.component.html` to conditionally display navigation based on authentication status.
- [ ] T029 Implement secure storage mechanism for JWT on the Angular frontend (e.g., `localStorage`, `sessionStorage`, or in-memory with refresh).

## Phase 3.4: Integration
- [x] T024 Integrate `auth.service.ts` with `app.component.ts` and other components requiring authentication status.
- [x] T025 Apply JWT authentication middleware to protected backend routes (e.g., agent routes).
- [ ] T030 Apply JWT authentication middleware to protected backend routes (e.g., agent routes, blog routes).

## Phase 3.5: Polish
- [x] T026 [P] Write unit tests for `auth.service.js` (backend) and `auth.service.ts` (frontend).
- [x] T027 [P] Implement error handling and user feedback for authentication failures in frontend components.
- [ ] T028 [P] Update `README.md` and `CHANGELOG.md` with authentication feature details.

## Dependencies
- Setup (T001-T003) before Tests (T004-T010)
- Tests (T004-T010) before Core Implementation (T011-T023)
- Core Implementation (T011-T023) before Integration (T024-T025)
- Integration (T024-T025) before Polish (T026-T028)

## Parallel Example
```
# Launch T004-T010 together:
Task: "Contract test POST /api/auth/register in backend/tests/contract/auth.test.js"
Task: "Contract test POST /api/auth/login in backend/tests/contract/auth.test.js"
Task: "Contract test POST /api/auth/refresh-token in backend/tests/contract/auth.test.js"
Task: "Integration test for 'User Registration and Login' scenario in frontend/e2e/src/auth.e2e-spec.ts"
Task: "Integration test for 'Accessing Protected Functionality' scenario in frontend/e2e/src/auth.e2e-spec.ts"
Task: "Integration test for 'Silent Token Refresh' scenario in frontend/e2e/src/auth.e2e-spec.ts"
Task: "Integration test for 'Invalid Credentials and Rate Limiting' scenario in frontend/e2e/src/auth.e2e-spec.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
