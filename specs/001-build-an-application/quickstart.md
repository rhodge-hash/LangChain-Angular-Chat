# Quickstart Guide: LangChain.js Agent with Angular Frontend

This guide provides a quick way to get the application running and verify its core functionality.

## Prerequisites
- Node.js (LTS version recommended)
- npm or yarn
- Angular CLI

## Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install # or yarn
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
1. **Access the application**: Ensure the Angular application loads successfully in your browser.
2. **Input a prompt**: Locate the input field on the page, type a prompt (e.g., "What is the capital of France?"), and submit it.
3. **Observe agent response**: Verify that a loading indicator appears, and then the processed response from the LangChain.js agent is displayed on the screen.
4. **Test empty prompt**: Try submitting an empty prompt. Verify that the system treats it as an invalid input (e.g., displays a validation message or prevents submission).
5. **Test error handling**: (Manual simulation or future integration test) If possible, simulate an agent error and verify that a specific error message from the agent is displayed.
