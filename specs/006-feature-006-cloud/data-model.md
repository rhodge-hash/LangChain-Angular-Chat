# Data Model for Feature 006: Cloud Deployment

## Entities

### Deployment Strategy
A documented plan outlining the steps and configurations for deploying the application to GCP.

*   **Attributes**:
    *   `platform`: String (e.g., 'GCP')
    *   `frontendHosting`: String (e.g., 'Cloud Storage + Cloud CDN')
    *   `backendHosting`: String (e.g., 'Cloud Run' or 'Kubernetes Cluster')
    *   `containerizationTool`: String (e.g., 'Docker')
    *   `ciCdTool`: String (e.g., 'Cloud Build')
    *   `secretManagement`: String (e.g., 'Google Secret Manager')
    *   `monitoringTools`: String (e.g., 'Cloud Monitoring + Cloud Logging')

### Docker Image
Containerized versions of the frontend and backend applications.

*   **Attributes**:
    *   `name`: String (e.g., 'frontend-app', 'backend-api')
    *   `version`: String (e.g., '1.0.0', 'latest')
    *   `registry`: String (e.g., 'Artifact Registry')

### Cloud Run/Kubernetes Cluster
GCP services for hosting and scaling the backend.

*   **Attributes**:
    *   `serviceName`: String
    *   `region`: String
    *   `autoScalingStrategy`: String (e.g., 'CPU utilization, RPS, custom metrics')

### Cloud Storage/Cloud CDN
GCP services for hosting and delivering the frontend.

*   **Attributes**:
    *   `bucketName`: String
    *   `cdnEnabled`: Boolean

### CI/CD Pipeline
Automated process for building, testing, and deploying the application.

*   **Attributes**:
    *   `tool`: String (e.g., 'Cloud Build')
    *   `trigger`: String (e.g., 'git push to main branch')
    *   `rollbackStrategy`: String (e.g., 'Automated rollback to last successful deployment')

### Monitoring
Tools and configurations for observing the health and performance of the deployed application.

*   **Attributes**:
    *   `tools`: String (e.g., 'Cloud Monitoring, Cloud Logging')
    *   `metrics`: Array of Strings (e.g., 'CPU utilization', 'RPS', 'latency')