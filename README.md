# LangChain.js Agent with Angular Frontend

## Project Description
This project demonstrates a full-stack application integrating a LangChain.js agent with an Angular frontend. Users can input prompts into a simple web interface, which are then processed by the LangChain.js agent hosted on a Node.js/Express.js backend. The primary goal is to showcase the agentic workflow of LangChain.js and its seamless integration within a modern web application.

## Features
- **Interactive Chat Interface**: A user-friendly Angular frontend for submitting prompts and viewing agent responses.
- **LangChain.js Integration**: Backend powered by a LangChain.js agent for intelligent prompt processing.
- **RESTful API**: A simple Express.js API to handle communication between the frontend and the LangChain.js agent.
- **Error Handling**: Robust error handling for invalid inputs and agent processing failures.
- **Loading Indicators**: Visual feedback to the user during agent processing.

## Technologies Used
- **Frontend**: Angular (with TypeScript)
  - **Unit/Integration Testing**: Jest
  - **End-to-End Testing**: Cypress
- **Backend**: Node.js with Express.js (with JavaScript/TypeScript)
  - **Agentic Framework**: LangChain.js
  - **Unit/Integration/API Testing**: Jest
- **API Definition**: OpenAPI (Swagger)

## Setup Instructions
To get the application up and running on your local machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Angular CLI](https://angular.io/cli) (install globally: `npm install -g @angular/cli`)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [repository-url] # Replace with your repository URL
    cd [repository-name]
    ```
2.  **Install Backend Dependencies**:
    Navigate to the `backend` directory and install the required packages:
    ```bash
    cd backend
    npm install
    cd ..
    ```
3.  **Install Frontend Dependencies**:
    Navigate to the `frontend` directory and install the required packages:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running the Application
1.  **Start the Backend Server**:
    Open a new terminal, navigate to the `backend` directory, and start the server:
    ```bash
    cd backend
    node src/main.js
    ```
    The backend server will typically run on `http://localhost:3000`.

2.  **Start the Angular Frontend**:
    Open another new terminal, navigate to the `frontend` directory, and start the Angular development server with proxy configuration:
    ```bash
    cd frontend
    ng serve --proxy-config proxy.conf.json
    ```
    The frontend application will typically be available at `http://localhost:4200`.

3.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:4200`.

## Testing

### Backend Tests
To run backend unit and contract tests:
```bash
cd backend
npm test
```

### Frontend Tests
To run frontend unit tests:
```bash
cd frontend
npm test
```

To run frontend end-to-end (E2E) tests (requires Cypress setup):
```bash
cd frontend
npx cypress open # Or your configured E2E test command
```

## API Endpoints

### `POST /api/process-prompt`
Processes a user prompt using the LangChain.js agent.

-   **Request Body** (`application/json`):
    ```json
    {
      "prompt": "What is the capital of France?"
    }
    ```
-   **Successful Response** (`200 OK`, `application/json`):
    ```json
    {
      "response": "Paris"
    }
    ```
-   **Error Responses**:
    -   `400 Bad Request`: If the `prompt` is empty or missing.
        ```json
        {
          "error": "Prompt cannot be empty."
        }
        ```
    -   `500 Internal Server Error`: If an error occurs during agent processing.
        ```json
        {
          "error": "An error occurred while processing the prompt."
        }
        ```

## Project Structure
```
. # Project Root
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── main.js
│   │   ├── routes/
│   │   │   └── agent.js
│   │   └── services/
│   │       └── agent.service.js
│   ├── tests/
│   │   ├── contract/
│   │   │   └── process-prompt.test.js
│   │   └── unit/
│   │       └── agent.test.js
│   ├── package.json
│   ├── .eslintrc.json
│   └── .prettierrc.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── agent-chat/
│   │   │   │       ├── agent-chat.component.css
│   │   │   │       ├── agent-chat.component.html
│   │   │   │       ├── agent-chat.component.spec.ts
│   │   │   │       └── agent-chat.component.ts
│   │   │   └── services/
│   │   │       ├── agent.service.spec.ts
│   │   │       └── agent.service.ts
│   │   └── ... (other Angular files)
│   ├── e2e/
│   │   └── src/
│   │       └── agent-chat.e2e-spec.ts
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   ├── .eslintrc.json
│   └── .prettierrc.json
├── specs/
│   └── 001-build-an-application/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       ├── tasks.md
│       └── contracts/
│           └── process-prompt.yaml
├── GEMINI.md
└── README.md
```

## Future Enhancements
- Implement more sophisticated LangChain.js agents with additional tools.
- Enhance the frontend UI/UX with better styling and responsiveness.
- Add user authentication and session management.
- Implement real-time communication (e.g., WebSockets) for agent responses.
- Deploy the application to a cloud platform.

## License
This project is licensed under the MIT License - see the LICENSE file for details. (Note: A LICENSE file is not provided in this example, but would typically be included.)
