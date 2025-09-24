# Tasks: LangChain.js Agent with Angular Frontend

**Input**: Design documents from `/specs/001-build-an-application/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`

## Phase 3.1: Setup
- [X] T001 Initialize backend Node.js project in `backend/` (e.g., `npm init -y`)
- [X] T002 Install backend dependencies: `express`, `langchain`, `jest`, `supertest` in `backend/`
- [X] T003 Initialize Angular frontend project in `frontend/` (e.g., `ng new frontend --skip-install`)
- [X] T004 Install frontend dependencies: `@angular/cli`, `jest`, `cypress` in `frontend/`
- [X] T005 [P] Configure ESLint/Prettier for backend in `backend/`
- [X] T006 [P] Configure ESLint/Prettier for frontend in `frontend/`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [X] T007 [P] Backend contract test for `POST /api/process-prompt` in `backend/tests/contract/process-prompt.test.js` (already created, verify it fails)
- [X] T008 [P] Frontend E2E test: Submit a prompt and display response in `frontend/e2e/src/agent-chat.e2e-spec.ts`
- [X] T009 [P] Frontend E2E test: Empty prompt validation in `frontend/e2e/src/agent-chat.e2e-spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Backend
- [X] T010 Create backend Express.js application entry point in `backend/src/app.js`
- [X] T011 Implement `POST /api/process-prompt` endpoint in `backend/src/routes/agent.js`
- [X] T012 Integrate LangChain.js agent logic into `backend/src/services/agent.service.js`
- [X] T013 Implement error handling for `POST /api/process-prompt` (400 for empty/missing prompt, 500 for agent errors) in `backend/src/routes/agent.js`
- [X] T014 Implement unit tests for LangChain.js agent logic in `backend/tests/unit/agent.test.js`

### Frontend
- [X] T015 Create Angular service for API communication in `frontend/src/app/services/agent.service.ts`
- [X] T016 Create Angular component for prompt input and response display in `frontend/src/app/components/agent-chat/agent-chat.component.ts`
- [X] T017 Implement loading indicator in `frontend/src/app/components/agent-chat/agent-chat.component.ts`
- [X] T018 Implement display of specific error messages from agent in `frontend/src/app/components/agent-chat/agent-chat.component.ts`
- [X] T019 Implement empty prompt validation in `frontend/src/app/components/agent-chat/agent-chat.component.ts`
- [X] T020 Implement unit tests for Angular service in `frontend/src/app/services/agent.service.spec.ts`
- [X] T021 Implement unit tests for Angular component in `frontend/src/app/components/agent-chat/agent-chat.component.spec.ts`

## Phase 3.4: Integration
- [X] T022 Connect frontend `agent.service.ts` to backend `POST /api/process-prompt` endpoint

## Phase 3.5: Polish
- [X] T023 Update `quickstart.md` with actual setup and run commands
- [X] T024 Review and refine backend code for performance (agent response time < 100ms)
- [X] T025 Review and refine frontend code for performance and responsiveness
- [X] T026 Basic styling for the Angular frontend components

## Dependencies
- T001-T006 must be completed before T007-T009.
- T007-T009 (Tests First) must be completed and failing before T010-T021 (Core Implementation).
- T010-T014 (Backend Core) must be completed before T022 (Integration).
- T015-T021 (Frontend Core) must be completed before T022 (Integration).
- T022 (Integration) must be completed before T023-T026 (Polish).
- T010 blocks T011.
- T011 blocks T012, T013.
- T012 blocks T014.
- T015 blocks T016.
- T016 blocks T017, T018, T019.
- T017, T018, T019 block T021.

## Parallel Example
```
# Setup tasks that can run in parallel:
Task: "T005 [P] Configure ESLint/Prettier for backend in `backend/`"
Task: "T006 [P] Configure ESLint/Prettier for frontend in `frontend/`"

# Tests First tasks that can run in parallel:
Task: "T007 [P] Backend contract test for `POST /api/process-prompt` in `backend/tests/contract/process-prompt.test.js`"
Task: "T008 [P] Frontend E2E test: Submit a prompt and display response in `frontend/e2e/src/agent-chat.e2e-spec.ts`"
Task: "T009 [P] Frontend E2E test: Empty prompt validation in `frontend/e2e/src/agent-chat.e2e-spec.ts`"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
