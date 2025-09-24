import { OpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { SerpAPI } from '@langchain/community/tools/serpapi';

// For demonstration purposes, we'll use a simple OpenAI LLM and SerpAPI tool.
// In a real application, you would configure these with API keys and more sophisticated tools.
const model = new OpenAI({ temperature: 0 });
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Austin, Texas, United States",
    hl: "en",
    gl: "us",
  }),
];

const executor = initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
});

async function processPrompt(prompt, ws, sessionId) { // Add ws and sessionId
  try {
    // LangChain streaming example (conceptual, actual implementation might vary based on LangChain.js version)
    const stream = await executor.stream({ input: prompt });

    ws.send(JSON.stringify({ type: 'start', sessionId: sessionId, timestamp: Date.now() }));

    for await (const chunk of stream) {
      // Assuming chunk has an 'output' property for the streamed text
      if (chunk.output) {
        ws.send(JSON.stringify({ type: 'chunk', sessionId: sessionId, content: chunk.output, timestamp: Date.now() }));
      }
    }

    ws.send(JSON.stringify({ type: 'end', sessionId: sessionId, timestamp: Date.now() }));

  } catch (error) {
    console.error('LangChain agent error:', error);
    ws.send(JSON.stringify({ type: 'error', sessionId: sessionId, error: 'Failed to get response from agent.', timestamp: Date.now() }));
    throw new Error('Failed to get response from agent.');
  }
}

export { processPrompt };
