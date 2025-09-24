import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { HumanMessage } from "@langchain/core/messages";
import { getPrompt } from "./prompt"; // We will define this later in the same file.

// In-memory "database" to store the blog posts.
// This is a simplified approach. For production, you'd use a real database.
const blogPosts = [];

// Define the LangChain agent here.
// You can use a more advanced agent, but this is a simple example.
const createAgent = async () => {
  // Define tools for the agent
  const retriever = new TavilySearchAPIRetriever({ k: 3 });
  const tools = [retriever];

  // Pull the prompt from a remote repository
  const prompt = await getPrompt();

  // Initialize the LLM
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Create the agent
  const agent = await createReactAgent({
    llm: model,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });
};

const generateBlogPost = async (topic) => {
  console.log(`Generating blog post on topic: "${topic}"`);

  try {
    const agentExecutor = await createAgent();

    // The agent's prompt to generate a blog post
    const agentPrompt = "
      You are an expert blogger. Your task is to write a detailed, engaging, and unique blog post on the topic \"${topic}\".
      Follow these steps:
      1. Use your search tool to research the topic. Gather information from at least 3 different sources.
      2. Synthesize the information into a single, cohesive blog post.
      3. The post should be at least 500 words long.
      4. Include a catchy title and clear subheadings.
      5. The final output must be in Markdown format, ready to be displayed.
    ";

    // The human message to the agent
    const result = await agentExecutor.invoke({
      input: agentPrompt,
      messages: [new HumanMessage({ content: agentPrompt })],
    });

    // Extract the final markdown content and title
    const markdownContent = result.output;
    const lines = markdownContent.split('\n');
    const title = lines[0].replace(/^#\s*/, '').trim() || `Blog Post on ${topic}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const newPost = {
      slug: slug,
      title: title,
      content: markdownContent,
      publishedAt: new Date().toISOString(),
    };

    blogPosts.push(newPost);
    console.log(`Successfully generated new blog post: "${newPost.title}"`);
    return newPost;

  } catch (error) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post');
  }
};

const getBlogPosts = () => {
  return blogPosts;
};

// A placeholder for the prompt. For a real application, you'd customize this.
const getPrompt = () => {
  return new Promise(resolve => {
    resolve (
      "You are an expert blogger. Your task is to write a detailed, engaging, and unique blog post on a given topic.      You must use your search tools to gather information and synthesize it. Your final output must be in a clean Markdown format with a title and at least 3 subheadings."
    );
  });
};

export { generateBlogPost, getBlogPosts };
