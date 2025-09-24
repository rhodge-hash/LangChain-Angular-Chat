const { processPrompt } = require('../../src/services/agent.service');

describe('agentService.processPrompt', () => {
  it('should process a prompt and return a response', async () => {
    // This is a basic test. In a real scenario, you would mock the LangChain.js agent
    // to avoid making actual API calls and to control the agent's behavior.
    // For this demonstration, we'll assume the agent works as expected.
    const prompt = 'What is the capital of France?';
    const response = await processPrompt(prompt);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('should throw an error if the agent fails', async () => {
    // Mocking the LangChain agent to simulate a failure
    jest.mock('langchain/llms/openai', () => ({
      OpenAI: jest.fn(() => ({
        call: jest.fn(() => {
          throw new Error('Agent failed to process prompt.');
        }),
      })),
    }));
    jest.mock('langchain/agents', () => ({
      initializeAgentExecutorWithOptions: jest.fn(() => ({
        call: jest.fn(() => {
          throw new Error('Agent failed to process prompt.');
        }),
      })),
    }));

    const prompt = 'Simulate agent failure';
    await expect(processPrompt(prompt)).rejects.toThrow('Failed to get response from agent.');
  });
});
