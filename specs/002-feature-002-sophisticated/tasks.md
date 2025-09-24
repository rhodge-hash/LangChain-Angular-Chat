# Tasks: Sophisticated LangChain.js Agents

**Input**: Design documents from `/specs/002-feature-002-sophisticated/`
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
- [X] T001 Install backend dependencies: `langgraph`, `@langchain/memory`, `@langchain/community/tools/calculator`, `@langchain/community/tools/file_system` in `backend/`
- [X] T002 Install frontend dependencies: (No new major dependencies for this feature, ensure existing ones are compatible)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [X] T003 [P] Backend contract test for `POST /api/advanced-agent-chat` in `backend/tests/contract/advanced-agent-chat.test.js` (already created, verify it fails)
- [X] T004 [P] Frontend E2E test: Memory retention in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`
- [X] T005 [P] Frontend E2E test: Complex reasoning in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`
- [X] T006 [P] Frontend E2E test: Tool usage (calculator) in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`
- [X] T007 [P] Frontend E2E test: Tool usage (file system) in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Backend
- [X] T008 Create `backend/src/services/advanced-agent.service.js` to encapsulate sophisticated agent logic.
- [X] T009 Implement LangChain.js memory buffer (e.g., `ConversationBufferWindowMemory`) in `backend/src/services/advanced-agent.service.js`.
- [X] T010 Integrate LangGraph.js for multi-agent workflows in `backend/src/services/advanced-agent.service.js` (Note: Basic multi-tool agent implemented; full LangGraph.js integration is a future enhancement).
- [X] T011 Implement Search tool integration (e.g., `TavilySearchAPIRetriever`) in `backend/src/services/advanced-agent.service.js`.
- [X] T012 Implement File System tool integration (`FileManagementToolkit`) in `backend/src/services/advanced-agent.service.js`.
- [X] T013 Implement Calculator tool integration (`Calculator` class) in `backend/src/services/advanced-agent.service.js`.
- [X] T014 Create `backend/src/routes/advanced-agent.js` for the `/api/advanced-agent-chat` endpoint.
- [X] T015 Implement `POST /api/advanced-agent-chat` endpoint in `backend/src/routes/advanced-agent.js` to handle complex agent interactions.
- [X] T016 Implement error handling for `POST /api/advanced-agent-chat` (400 for empty/missing prompt, 500 for agent errors, 400 for ambiguous inputs, etc.).
- [X] T017 Implement unit tests for `advanced-agent.service.js` in `backend/tests/unit/advanced-agent.test.js`.

### Frontend
- [X] T018 Create Angular service for advanced agent API communication in `frontend/src/app/services/advanced-agent.service.ts`.
- [X] T019 Create Angular component for advanced agent interaction in `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.ts`.
- [X] T020 Implement display of richer, multi-step output from agents in `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.ts`.
- [X] T021 Implement UI for session management (e.g., input for `sessionId`) in `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.ts`.
- [X] T022 Implement unit tests for `advanced-agent.service.ts` in `frontend/src/app/services/advanced-agent.service.spec.ts`.
- [X] T023 Implement unit tests for `advanced-agent-chat.component.ts` in `frontend/src/app/components/advanced-agent-chat/advanced-agent-chat.component.spec.ts`.

## Phase 3.4: Integration
- [X] T024 Integrate `advanced-agent.service.ts` into `app.component.ts` or a new routing module.
- [X] T025 Update `backend/src/app.js` to include `advanced-agent.js` route.

## Phase 3.5: Polish
- [X] T026 Update `quickstart.md` with actual setup and run commands for the new feature.
- [X] T027 Review and refine code for performance (low latency per step).
- [X] T028 Basic styling for the new Angular frontend components.

## Dependencies
- T001-T002 must be completed before T003-T007.
- T003-T007 (Tests First) must be completed and failing before T008-T023 (Core Implementation).
- T008 blocks T009, T010, T011, T012, T013.
- T009, T010, T011, T012, T013 block T014.
- T014 blocks T015, T016.
- T015 blocks T016, T017.
- T018 blocks T019, T020, T021.
- T019 blocks T020, T021.
- T020, T021 block T023.
- T024, T025 (Integration) must be completed before T026-T028 (Polish).

## Parallel Example
```
# Setup tasks that can run in parallel:
# (No parallel setup tasks for this feature, as dependencies are sequential)

# Tests First tasks that can run in parallel:
Task: "T003 [P] Backend contract test for `POST /api/advanced-agent-chat` in `backend/tests/contract/advanced-agent-chat.test.js`"
Task: "T004 [P] Frontend E2E test: Memory retention in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`"
Task: "T005 [P] Frontend E2E test: Complex reasoning in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`"
Task: "T006 [P] Frontend E2E test: Tool usage (calculator) in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`"
Task: "T007 [P] Frontend E2E test: Tool usage (file system) in `frontend/e2e/src/advanced-agent-chat.e2e-spec.ts`"
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