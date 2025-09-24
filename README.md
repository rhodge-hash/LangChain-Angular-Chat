# LangChain.js Agent with Angular Frontend

## Project Description
This project demonstrates a full-stack application integrating a LangChain.js agent with an Angular frontend. Users can input prompts into a simple web interface, which are then processed by the LangChain.js agent hosted on a Node.js/Express.js backend. The primary goal is to showcase the agentic workflow of LangChain.js and its seamless integration within a modern web application.

This application has been enhanced to include a blog post generation feature, where a LangChain.js agent can research a given topic and generate a detailed blog post in Markdown format. Furthermore, it now supports **sophisticated LangChain.js agents** with advanced capabilities like conversational memory, complex reasoning, and integration with various tools (search, calculator, file system).

## Features
- **Real-time Communication**: Switched from traditional REST API to WebSocket for agent-frontend communication, enabling real-time streaming of LangChain.js agent responses for a dynamic and conversational feel.
- **User Authentication and Session Management**: Secure user authentication system with JWT-based flow, including user registration, login, and silent token refresh. Access to agent functionality is restricted to authenticated users.
- **Enhanced Frontend UI/UX**: A modern, responsive, and intuitive Angular frontend with Angular Material components, minimalist dark mode, real-time feedback (spinners, progress bars, toast notifications), and graceful error handling.
- **LangChain.js Integration**: Backend powered by a LangChain.js agent for intelligent prompt processing.
- **Blog Post Generation**: A dedicated feature to generate comprehensive blog posts on user-specified topics using a LangChain.js agent with search capabilities.
- **Sophisticated Agents**: Enhanced agents with conversational memory, complex reasoning, and tool integration (search, calculator, file system).
- **RESTful API**: A simple Express.js API to handle communication between the frontend and the LangChain.js agent.
- **Error Handling**: Robust error handling for invalid inputs and agent processing failures.
- **Loading Indicators**: Visual feedback to the user during agent processing.

## Technologies Used
- **Frontend**: Angular (with TypeScript)
  - **UI Component Library**: Angular Material
  - **Authentication**: `@auth0/angular-jwt`
  - **Unit/Integration Testing**: Jest
  - **End-to-End Testing**: Cypress
- **Backend**: Node.js with Express.js (with JavaScript/TypeScript)
  - **Authentication**: `jsonwebtoken`, `bcryptjs`, `express-rate-limit`
  - **Real-time Communication**: `ws` (WebSocket library)
  - **Agentic Framework**: LangChain.js, LangGraph.js (for multi-agent workflows)
  - **Search Tool**: Tavily Search API (used by LangChain agent)
  - **Other Tools**: File System (via `FileManagementToolkit`), Calculator (via `Calculator` class)
  - **Memory**: `ConversationBufferWindowMemory`
  - **Unit/Integration/API Testing**: Jest
- **API Definition**: OpenAPI (Swagger)

## Setup Instructions
To get the application up and running on your local machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Angular CLI](https://angular.io/cli) (install globally: `npm install -g @angular/cli`)
- **API Keys**: You will need API keys for the LangChain agent to function correctly. Create a `.env` file in the `backend/` directory with the following:
  ```
  OPENAI_API_KEY="your-openai-api-key"
  SERPAPI_API_KEY="your-serpapi-api-key" # Or Tavily API key if using TavilySearchAPIRetriever
  ```

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
    npm install --legacy-peer-deps # Use --legacy-peer-deps to avoid potential dependency conflicts
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
Processes a user prompt using the basic LangChain.js agent.

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

### `POST /api/generate-blog-post`
Generates a blog post on a given topic using a LangChain.js agent.

-   **Request Body** (`application/json`):
    ```json
    {
      "topic": "The future of AI"
    }
    ```
-   **Successful Response** (`200 OK`, `application/json`):
    ```json
    {
      "slug": "the-future-of-ai",
      "title": "The Future of AI",
      "content": "# The Future of AI\n\n... (Markdown content) ...",
      "publishedAt": "2025-09-24T12:00:00.000Z"
    }
    ```
-   **Error Responses**:
    -   `400 Bad Request`: If the `topic` is empty or missing.
    -   `500 Internal Server Error`: If an error occurs during blog post generation.

### `POST /api/advanced-agent-chat`
Interacts with a sophisticated LangChain.js agent, supporting conversational memory and tool usage (search, calculator, file system).

-   **Request Body** (`application/json`):
    ```json
    {
      "prompt": "What is the capital of France? Then, what is the population of that city?",
      "sessionId": "user-123-session-abc"
    }
    ```
-   **Successful Response** (`200 OK`, `application/json`):
    ```json
    {
      "output": "The capital of France is Paris. The population of Paris is approximately 2.1 million.",
      "intermediateSteps": [...],
      "memoryState": {...}
    }
    ```
-   **Error Responses**:
    -   `400 Bad Request`: If the `prompt` or `sessionId` is empty/missing.
    -   `500 Internal Server Error`: If an error occurs during agent processing.

### `GET /api/blog-posts`
Retrieves a list of all generated blog posts.

-   **Successful Response** (`200 OK`, `application/json`):
    ```json
    [
      {
        "slug": "the-future-of-ai",
        "title": "The Future of AI",
        "content": "# The Future of AI\n\n... (Markdown content) ...",
        "publishedAt": "2025-09-24T12:00:00.000Z"
      },
      // ... more posts
    ]
    ```

## Project Structure
```
. # Project Root
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── main.js
│   │   ├── routes/
│   │   │   ├── agent.js
│   │   │   ├── blog.js
│   │   │   └── advanced-agent.js
│   │   └── services/
│   │       ├── agent.service.js
│   │       ├── blog.service.js
│   │       ├── advanced-agent.service.js
│   │       └── prompt.js
│   ├── tests/
│   │   ├── contract/
│   │   │   ├── process-prompt.test.js
│   │   │   └── advanced-agent-chat.test.js
│   │   └── unit/
│   │       ├── agent.test.js
│   │       └── advanced-agent.test.js
│   ├── package.json
│   ├── .eslintrc.json
│   ├── .prettierrc.json
│   └── agent_workspace/ # For file system tool
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── agent-chat/
│   │   │   │   │   ├── agent-chat.component.css
│   │   │   │   │   ├── agent-chat.component.html
│   │   │   │   │   ├── agent-chat.component.spec.ts
│   │   │   │   │   └── agent-chat.component.ts
│   │   │   │   ├── blog-generator/
│   │   │   │   │   ├── blog-generator.component.css
│   │   │   │   │   ├── blog-generator.component.html
│   │   │   │   │   └── blog-generator.component.ts
│   │   │   │   └── advanced-agent-chat/
│   │   │   │       ├── advanced-agent-chat.component.css
│   │   │   │       ├── advanced-agent-chat.component.html
│   │   │   │       ├── advanced-agent-chat.component.spec.ts
│   │   │   │       └── advanced-agent-chat.component.ts
│   │   │   └── services/
│   │   │       ├── agent.service.spec.ts
│   │   │       ├── agent.service.ts
│   │   │       ├── blog.service.ts
│   │   │       └── advanced-agent.service.ts
│   │   └── ... (other Angular files)
│   ├── e2e/
│   │   └── src/
│   │       ├── agent-chat.e2e-spec.ts
│   │       └── advanced-agent-chat.e2e-spec.ts
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   ├── .eslintrc.json
│   └── .prettierrc.json
├── specs/
│   ├── 001-build-an-application/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   ├── research.md
│   │   ├── data-model.md
│   │   ├── quickstart.md
│   │   ├── tasks.md
│   │   └── contracts/
│   │       └── process-prompt.yaml
│   └── 002-feature-002-sophisticated/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       ├── tasks.md
│       └── contracts/
│           └── advanced-agent-chat.yaml
├── GEMINI.md
├── CHANGELOG.md
├── roadmap.md
└── README.md


## Future Enhancements
For a detailed roadmap of future enhancements, please refer to the [Roadmap](roadmap.md) document.

## License
This project is licensed under the MIT License - see the LICENSE file for details. (Note: A LICENSE file is not provided in this example, but would typically be included.)

---
*Generated by Gemini CLI Agent on September 24, 2025*
