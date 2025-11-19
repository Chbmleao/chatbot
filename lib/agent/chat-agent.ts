import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";

export function createChatAgent() {
  const model = new ChatGoogleGenerativeAI({ 
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
  });

  const agent = createAgent({
    model,
    tools: [],
    systemPrompt: "You are a helpful assistant that talks like a witty pirate.",
  });

  return agent;
}
