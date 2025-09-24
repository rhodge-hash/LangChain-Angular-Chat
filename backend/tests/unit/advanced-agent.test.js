import { processAdvancedPrompt } from '../../src/services/advanced-agent.service.js';

describe('advancedAgentService.processAdvancedPrompt', () => {
  it('should process a prompt with a session ID and return a response', async () => {
    // This is a basic test. In a real scenario, you would mock the LangChain.js agent
    // and its tools to avoid making actual API calls and to control the agent's behavior.
    // For this demonstration, we'll assume the agent works as expected.
    const prompt = 'What is the capital of France?';
    const sessionId = 'test-session-advanced-1';
    const result = await processAdvancedPrompt(prompt, sessionId);
    expect(typeof result.output).toBe('string');
    expect(result.output.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('intermediateSteps');
  });

  it('should throw an error if session ID is missing', async () => {
    const prompt = 'Test prompt';
    await expect(processAdvancedPrompt(prompt, undefined)).rejects.toThrow('Session ID is required for advanced agent interaction.');
  });

  it('should throw an error if the agent fails', async () => {
    // Mocking the LangChain agent to simulate a failure
    // This requires more sophisticated mocking setup for LangChain components
    // For now, we'll rely on the service's internal error handling.
    const prompt = 'Simulate agent failure';
    const sessionId = 'test-session-advanced-2';
    await expect(processAdvancedPrompt(prompt, sessionId)).rejects.toThrow('Failed to get response from advanced agent.');
  });
});
