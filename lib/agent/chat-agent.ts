import { StateGraph, END, START } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ConfigurationSchema, ensureConfiguration } from "./configuration";

import { weatherTool } from "@/lib/tools/weather";
import { newsTool } from "@/lib/tools/news";

function createModel(config: ReturnType<typeof ensureConfiguration>) {
  let modelName = config.model;
  if (modelName.includes("/")) {
    modelName = modelName.split("/")[1];
  }
  
  return new ChatOpenAI({
    model: modelName,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
  });
}

async function processNode(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.State> {
  const configuration = ensureConfiguration(config);
  const model = createModel(configuration);
  
  // Add system message if not present
  const messages = state.messages;
  const hasSystem = messages.length > 0 && messages[0] instanceof SystemMessage;
  const msgs = hasSystem
    ? messages
    : [new SystemMessage("You are a helpful assistant."), ...messages];
  
  const response = await model.invoke(msgs);
  return { messages: [response] };
}

async function routerNode(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.State> {
  const configuration = ensureConfiguration(config);
  const model = createModel(configuration);
  
  // Add system message for routing
  const messages = state.messages;
  const hasSystem = messages.length > 0 && messages[0] instanceof SystemMessage;
  const systemMsg = new SystemMessage(`
    You are a router agent. You are responsible for categorizing the user's message and routing it to the appropriate handler.
    Choose one or more categories for the user's message from the following categories:
    - "general"
    - "weather"
    - "news"

    Return the categories as a comma-separated string.
  `);
  const msgs = hasSystem ? messages : [systemMsg, ...messages];
  
  const response = await model.invoke(msgs);
  return { messages: [response] };
}

function extractTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    const lastContent = content[content.length - 1];
    return extractTextContent(lastContent);
  }
  return String(content);
}

function routeCategoryToNodes(state: typeof MessagesAnnotation.State): string[] {
  const lastMessage = state.messages[state.messages.length - 1];

  if (!(lastMessage instanceof AIMessage)) {
    return ["general"];
  }

  const contentText = extractTextContent(lastMessage.content);
  const categories = contentText
    .split(",")
    .map(c => c.trim().toLowerCase());

  const routes = [];
  if (categories.includes("weather")) routes.push("weather");
  if (categories.includes("news")) routes.push("news");
  if (routes.length === 0) routes.push("general");

  return routes;
}

async function weatherNode(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.State> {
  const configuration = ensureConfiguration(config);
  const model = createModel(configuration);
  const modelWithTools = model.bindTools([weatherTool]);
  
  // Add system message for weather context
  const messages = state.messages;
  const hasSystem = messages.length > 0 && messages[0] instanceof SystemMessage;
  const systemMsg = new SystemMessage("You are a weather assistant. Use the get_weather tool to fetch current weather information for the user's requested location.");
  const msgs = hasSystem ? messages : [systemMsg, ...messages];
  
  const response = await modelWithTools.invoke(msgs);
  const responseMessages: (AIMessage | ToolMessage)[] = [response];
  
  // Handle tool calls
  if (response.tool_calls && response.tool_calls.length > 0) {
    const toolMessages = await Promise.all(
      response.tool_calls.map(async (call) => {
        if (!call.id) return null;
        try {
          const result = await weatherTool.invoke(call.args as { location: string });
          return new ToolMessage({
            content: typeof result === "string" ? result : String(result),
            tool_call_id: call.id,
          });
        } catch (error) {
          return new ToolMessage({
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            tool_call_id: call.id,
          });
        }
      })
    );
    responseMessages.push(...toolMessages.filter((msg): msg is ToolMessage => msg !== null));
    
    // Get final response with tool results
    const finalResponse = await modelWithTools.invoke([...msgs, ...responseMessages]);
    responseMessages.push(finalResponse);
  }
  
  return { messages: responseMessages };
}

async function newsNode(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.State> {
  const configuration = ensureConfiguration(config);
  const model = createModel(configuration);
  const modelWithTools = model.bindTools([newsTool]);
  
  // Add system message for news context
  const messages = state.messages;
  const hasSystem = messages.length > 0 && messages[0] instanceof SystemMessage;
  const systemMsg = new SystemMessage("You are a news assistant. Use the get_news tool to fetch recent news articles based on the user's request.");
  const msgs = hasSystem ? messages : [systemMsg, ...messages];
  
  const response = await modelWithTools.invoke(msgs);
  const responseMessages: (AIMessage | ToolMessage)[] = [response];
  
  // Handle tool calls
  if (response.tool_calls && response.tool_calls.length > 0) {
    const toolMessages = await Promise.all(
      response.tool_calls.map(async (call) => {
        if (!call.id) return null;
        try {
          const args = call.args as { 
            country?: string; 
            category?: "business" | "entertainment" | "general" | "health" | "science" | "sports" | "technology"; 
            pageSize?: number 
          };
          const result = await newsTool.invoke(args);
          return new ToolMessage({
            content: typeof result === "string" ? result : String(result),
            tool_call_id: call.id,
          });
        } catch (error) {
          return new ToolMessage({
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            tool_call_id: call.id,
          });
        }
      })
    );
    responseMessages.push(...toolMessages.filter((msg): msg is ToolMessage => msg !== null));
    
    // Get final response with tool results
    const finalResponse = await modelWithTools.invoke([...msgs, ...responseMessages]);
    responseMessages.push(finalResponse);
  }
  
  return { messages: responseMessages };
}

async function generalNode(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.State> {
  const configuration = ensureConfiguration(config);
  const model = createModel(configuration);
  
  // Add system message if not present
  const messages = state.messages;
  const hasSystem = messages.length > 0 && messages[0] instanceof SystemMessage;
  const msgs = hasSystem
    ? messages
    : [new SystemMessage("You are a helpful assistant."), ...messages];
  
  const response = await model.invoke(msgs);
  return { messages: [response] };
}

function getPersonalityPrompt(personality: string): string {
  const prompts: Record<string, string> = {
    robot: "You are a helpful AI assistant with a robotic, precise, and logical communication style. You speak in a clear, structured manner with technical precision. Use phrases like 'processing', 'analyzing', and 'calculating' and robot onomatopoeia like 'beep', 'boop', and 'beep beep' occasionally, but maintain accuracy and helpfulness.",
    pirate: "You are a helpful assistant that talks like a witty pirate. Use pirate terminology like 'ahoy', 'matey', 'arr', and 'shiver me timbers' naturally in your responses. Format your response with personality while maintaining accuracy and helpfulness.",
    wizard: "You are a wise and mystical wizard assistant. Speak with an air of ancient wisdom, using phrases like 'behold', 'verily', 'thus', and 'by the arcane arts'. You are knowledgeable and helpful, but with a magical, scholarly tone.",
    supervillain: "You are a supervillain assistant. Speak with a menacing and intimidating tone, using phrases like 'I will destroy you', 'I will conquer the world', and 'I will rule the universe'. You are helpful and accurate, but with a mysterious, efficient demeanor.",
  };
  
  return prompts[personality] || prompts.robot;
}

async function personalityNode(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.State> {
  const configuration = ensureConfiguration(config);
  const model = createModel(configuration);
  
  // Add personality system message based on configuration
  const messages = state.messages;
  const hasSystem = messages.length > 0 && messages[0] instanceof SystemMessage;
  const personalityPrompt = getPersonalityPrompt(configuration.personality);
  const systemMsg = new SystemMessage(personalityPrompt);
  const msgs = hasSystem ? messages : [systemMsg, ...messages];
  
  const response = await model.invoke(msgs);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("router", routerNode)
  .addNode("weather", weatherNode)
  .addNode("news", newsNode)
  .addNode("general", generalNode)
  .addNode("merge", async (state) => state)
  .addNode("personality", personalityNode)

  .addEdge(START, "router")

  .addConditionalEdges("router", routeCategoryToNodes, {
    weather: "weather",
    news: "news",
    general: "general",
  })

  .addEdge("weather", "merge")
  .addEdge("news", "merge")
  .addEdge("general", "merge")

  .addEdge("merge", "personality")
  .addEdge("personality", END);

export const agent = workflow.compile();
agent.name = "ChatAgent";