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

async function processPrompt(prompt) {
  try {
    const result = await executor.call({ input: prompt });
    return result.output;
  } catch (error) {
    console.error('LangChain agent error:', error);
    throw new Error('Failed to get response from agent.');
  }
}

export { processPrompt };
