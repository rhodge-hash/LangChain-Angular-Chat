# Tasks: Cloud Deployment

**Input**: Design documents from `/specs/006-feature-006-cloud/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`

## Phase 3.1: Setup
- [x] T001 Configure GCP Project: Create a new GCP project and enable the necessary APIs, including Cloud Run, Cloud Storage, Cloud CDN, Artifact Registry, and Cloud Build.
- [x] T002 Create Dockerfile for the Express.js backend in `backend/Dockerfile`.
- [x] T003 Create Dockerfile for the Angular frontend in `frontend/Dockerfile`.
- [x] T004 Build and test backend Docker image locally.
- [x] T005 Build and test frontend Docker image locally.
- [x] T006 Set up Google Secret Manager to store sensitive environment variables (e.g., API keys).

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T007 [P] Integration test for backend deployment to Cloud Run/Kubernetes.
- [x] T008 [P] Integration test for frontend deployment to Cloud Storage and Cloud CDN.
- [x] T009 [P] Integration test for CI/CD pipeline functionality.
- [x] T010 [P] Integration test for monitoring setup.

## Phase 3.3: Core Implementation (Backend Deployment) (ONLY after tests are failing)
- [x] T011 Push backend Docker image to Google Cloud's Artifact Registry.
- [x] T012 Deploy backend image to Cloud Run, configuring environment variables and auto-scaling rules (CPU utilization, RPS, custom metrics).
- [x] T013 Configure Cloud Run to access secrets from Secret Manager.

## Phase 3.3: Core Implementation (Frontend Deployment) (ONLY after tests are failing)
- [x] T014 Push frontend Docker image to Artifact Registry.
- [x] T015 Extract static build assets from the frontend image and upload them to a Cloud Storage bucket.
- [x] T016 Configure the Cloud Storage bucket for static website hosting.
- [x] T017 Set up Cloud CDN with the Cloud Storage bucket as the backend.
- [x] T018 Implement a global external HTTP(S) Load Balancer in front of Cloud Run.

## Phase 3.4: CI/CD & Automation
- [x] T019 Create `cloudbuild.yaml` for CI/CD pipeline (trigger on git push to main, build/push backend Docker, deploy backend to Cloud Run).
- [x] T020 Extend `cloudbuild.yaml` to build/push frontend Docker and sync static assets to Cloud Storage.
- [x] T021 Configure Cloud Build triggers for automated deployments.

## Phase 3.5: Polish
- [ ] T022 [P] Document deployment strategy, including containerization, deployment steps, environment variables, CI/CD, and monitoring.
- [ ] T023 [P] Document CI/CD rollback strategy.
- [ ] T024 [P] Document target performance metrics for the deployed application.

## Dependencies
- Setup (T001-T006) before Tests (T007-T010)
- Tests (T007-T010) before Core Implementation (T011-T018)
- Core Implementation (T011-T018) before CI/CD & Automation (T019-T021)
- CI/CD & Automation (T019-T021) before Polish (T022-T024)

## Parallel Example
```
# Launch T007-T010 together:
Task: "Integration test for backend deployment to Cloud Run/Kubernetes."
Task: "Integration test for frontend deployment to Cloud Storage and Cloud CDN."
Task: "Integration test for CI/CD pipeline functionality."
Task: "Integration test for monitoring setup."
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
