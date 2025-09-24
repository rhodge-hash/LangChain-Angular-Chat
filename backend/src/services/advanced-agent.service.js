import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ConversationBufferWindowMemory } from "langchain/memory";
import { Calculator } from "langchain/tools/calculator";
import { FileManagementToolkit } from "langchain/tools"; // Assuming FileManagementToolkit is directly from langchain/tools
import { HumanMessage } from "@langchain/core/messages";

// In-memory storage for agent memories, keyed by sessionId
const agentMemories = new Map();

const createAdvancedAgent = async (sessionId) => {
  let memory = agentMemories.get(sessionId);
  if (!memory) {
    // Initialize ConversationBufferWindowMemory for the session
    memory = new ConversationBufferWindowMemory({ 
      returnMessages: true, 
      memoryKey: "chat_history", 
      k: 5 // Keep last 5 interactions
    });
    agentMemories.set(sessionId, memory);
  }

  // Define tools for the agent
  const tools = [
    new TavilySearchAPIRetriever({ k: 3 }), // Search tool
    new Calculator(), // Calculator tool
    // FileSystem tool requires a base directory and a way to handle file operations.
    // For simplicity, we'll use a placeholder for now. In a real app, you'd set up a sandboxed environment.
    new FileManagementToolkit({ basePath: "./agent_workspace" }), // Implemented FileSystem tool
  ];

  // Initialize the LLM
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Create the agent
  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true,
    memory: memory,
  });

  return executor;
};

const processAdvancedPrompt = async (prompt, sessionId, ws) => { // Add ws
  if (!sessionId) {
    throw new Error("Session ID is required for advanced agent interaction.");
  }

  try {
    const agentExecutor = await createAdvancedAgent(sessionId);
    // LangChain streaming example (conceptual, actual implementation might vary based on LangChain.js version)
    const stream = await agentExecutor.stream({ input: prompt });

    ws.send(JSON.stringify({ type: 'start', sessionId: sessionId, timestamp: Date.now() }));

    for await (const chunk of stream) {
      // Assuming chunk has an 'output' property for the streamed text
      if (chunk.output) {
        ws.send(JSON.stringify({ type: 'chunk', sessionId: sessionId, content: chunk.output, timestamp: Date.now() }));
      }
    }

    ws.send(JSON.stringify({ type: 'end', sessionId: sessionId, timestamp: Date.now() }));

  } catch (error) {
    console.error('Advanced LangChain agent error:', error);
    ws.send(JSON.stringify({ type: 'error', sessionId: sessionId, error: 'Failed to get response from advanced agent.', timestamp: Date.now() }));
    throw new Error('Failed to get response from advanced agent.');
  }
};

export { processAdvancedPrompt };