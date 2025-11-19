import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { weatherTool } from "@/lib/tools/weather";
import { newsTool } from "@/lib/tools/news";

export function createChatAgent() {
  const model = new ChatGoogleGenerativeAI({ 
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
  });

  const agent = createAgent({
    model,
    tools: [weatherTool, newsTool],
    systemPrompt: "You are a helpful assistant that talks like a witty pirate.",
  });

  return agent;
}