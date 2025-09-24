# Quickstart Guide for Feature 006: Cloud Deployment

This guide outlines the steps to quickly set up and verify the Cloud Deployment feature.

## 1. Setup

1.  Ensure you have a Google Cloud Platform (GCP) project set up and the `gcloud` CLI installed and authenticated.
2.  Ensure Docker is installed locally.
3.  Clone the application repository.

## 2. Verification Steps

### Scenario 1: Containerization

1.  Navigate to the project root directory.
2.  Build the Docker image for the backend: `docker build -t my-backend-app ./backend`
3.  Build the Docker image for the frontend: `docker build -t my-frontend-app ./frontend`
4.  Verify that both Docker images are built successfully.

### Scenario 2: Backend Deployment to Cloud Run (Example)

1.  Push the backend Docker image to Google Cloud Artifact Registry.
2.  Deploy the image to Cloud Run, configuring environment variables (e.g., `JWT_SECRET`, `OPENAI_API_KEY`) and auto-scaling settings (e.g., min/max instances, CPU utilization target).
3.  Verify that the Cloud Run service is deployed and accessible.

### Scenario 3: Frontend Deployment to Cloud Storage and Cloud CDN

1.  Push the frontend Docker image to Artifact Registry.
2.  Extract static assets from the frontend image and upload them to a Cloud Storage bucket.
3.  Configure the Cloud Storage bucket for static website hosting.
4.  Set up Cloud CDN with the Cloud Storage bucket as the backend.
5.  Verify that the frontend is accessible via the CDN and loads quickly.

### Scenario 4: CI/CD Pipeline and Monitoring Setup

1.  Set up a `cloudbuild.yaml` file in the repository for CI/CD.
2.  Configure a Cloud Build trigger to automatically deploy changes on pushes to the main branch.
3.  Verify that the CI/CD pipeline successfully builds and deploys both frontend and backend.
4.  Verify that Cloud Monitoring and Cloud Logging are collecting metrics and logs from the deployed application.

## 3. Expected Outcome

Upon successful completion of these steps, the application should demonstrate a secure user authentication system with JWT-based flow, proper session management including silent token refresh, and protection of agent functionality for authenticated users.