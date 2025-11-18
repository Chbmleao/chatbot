import { NextRequest, NextResponse } from "next/server";
import { createChatAgent } from "@/lib/agent/chat-agent";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Create the agent
    const agent = createChatAgent();

    // Convert history to LangChain messages
    const messages = (history || []).map((msg: { role: string; content: string }) => {
      return msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content);
    });

    // Add the current user message
    messages.push(new HumanMessage(message));

    // Run the agent with the conversation history
    const result = await agent.invoke({
      messages,
    });

    // Get the last AI message from the result
    const lastMessage = (result.messages as BaseMessage[])[(result.messages as BaseMessage[]).length - 1];
    const response = lastMessage.content as string;

    return NextResponse.json({
      response,
      history: (result.messages as BaseMessage[]).map((msg: BaseMessage) => ({
        role: msg instanceof HumanMessage ? "user" : "assistant",
        content: msg.content,
      })),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

