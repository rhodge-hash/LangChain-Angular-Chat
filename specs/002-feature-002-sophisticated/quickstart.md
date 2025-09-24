# Quickstart Guide: Sophisticated LangChain.js Agents

This guide provides a quick way to get the application running and verify its core functionality, including the new sophisticated agent capabilities.

## Prerequisites
- Node.js (LTS version recommended)
- npm or yarn
- Angular CLI
- **API Keys**: You will need API keys for the LangChain agent to function correctly. Create a `.env` file in the `backend/` directory with the following:
  ```
  OPENAI_API_KEY="your-openai-api-key"
  SERPAPI_API_KEY="your-serpapi-api-key" # Or Tavily API key if using TavilySearchAPIRetriever
  ```

## Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install --legacy-peer-deps # or yarn
   cd ..
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install # or yarn
   cd ..
   ```

## Running the Application
1. Start the backend server:
   ```bash
   cd backend
   node src/main.js
   ```
2. Start the Angular frontend:
   ```bash
   cd frontend
   ng serve --proxy-config proxy.conf.json
   ```
3. Open your browser and navigate to `http://localhost:4200` (or the address provided by `ng serve`).

## Verification Steps

### Basic Agent Interaction (from previous feature)
1. **Access the application**: Ensure the Angular application loads successfully in your browser.
2. **Input a prompt**: Locate the input field on the page, type a prompt (e.g., "What is the capital of France?"), and submit it.
3. **Observe agent response**: Verify that a loading indicator appears, and then the processed response from the LangChain.js agent is displayed on the screen.
4. **Test empty prompt**: Try submitting an empty prompt. Verify that the system treats it as an invalid input (e.g., displays a validation message or prevents submission).
5. **Test error handling**: (Manual simulation or future integration test) If possible, simulate an agent error and verify that a specific error message from the agent is displayed.

### Sophisticated Agent Interaction (new feature)
1. **Memory Test**: 
   - Input a prompt: "My name is Alice."
   - Input a follow-up prompt: "What is my name?"
   - **Expected**: The agent should respond with "Your name is Alice." demonstrating memory retention.
2. **Complex Reasoning Test**: 
   - Input a prompt: "What is the capital of France? Then, what is the population of that city?"
   - **Expected**: The agent should provide both the capital and its population, demonstrating multi-step reasoning and tool usage (search).
3. **Tool Usage Test (Calculator)**:
   - Input a prompt: "What is 123 plus 456?"
   - **Expected**: The agent should provide the correct sum (579) using the calculator tool.
4. **Tool Usage Test (File System)**:
   - Input a prompt: "Create a file named 'test.txt' with content 'Hello from agent'."
   - **Expected**: The agent should confirm file creation, and you should be able to verify the file exists in the designated agent workspace.
   - Input a prompt: "Read the content of 'test.txt'."
   - **Expected**: The agent should return "Hello from agent".
