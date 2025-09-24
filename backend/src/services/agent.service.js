const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { SerpAPI } = require('langchain/tools');

// For demonstration purposes, we'll use a simple OpenAI LLM and SerpAPI tool.
// In a real application, you would configure these with API keys and more sophisticated tools.
const model = new OpenAI({ temperature: 0 });
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, { // SERPAPI_API_KEY needs to be set in environment variables
    location: "Austin, Texas, United States",
    hl: "en",
    gl: "us",
  }),
];

const executor = initializeAgentExecutorWithOptions(tools, model, { // Removed 'agentType' as it's not a valid option
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

module.exports = { processPrompt };
