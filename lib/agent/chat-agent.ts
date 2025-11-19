import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, END, START } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";

export function createChatAgent() {
  const model = new ChatGoogleGenerativeAI({  // Swap here
    model: "gemini-2.5-flash",  // Fast/free tier model; try "gemini-1.5-pro" for better quality
    apiKey: process.env.GOOGLE_API_KEY,  // Your free key here
    temperature: 0.7,
  });

  async function chatNode(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  }

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("chat", chatNode)
    .addEdge(START, "chat")
    .addEdge("chat", END);

  return workflow.compile();
}
