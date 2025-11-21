import { NextRequest, NextResponse } from "next/server";
import { agent } from "@/lib/agent/chat-agent";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

export const runtime = "nodejs";
export const maxDuration = 30;

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

function isHumanMessage(msg: BaseMessage): msg is HumanMessage {
  return msg instanceof HumanMessage;
}

function isAIMessage(msg: BaseMessage): msg is AIMessage {
  return msg instanceof AIMessage;
}

function isMessage(msg: BaseMessage): msg is HumanMessage | AIMessage {
  return isHumanMessage(msg) || (isAIMessage(msg) && typeof msg.content === "string");
}

function extractHistory(history: BaseMessage[]): { role: string; content: string }[] {
  return history
    .filter(isMessage)
    .map((msg) => ({
      role: isHumanMessage(msg) ? "user" : "assistant",
      content: extractTextContent(msg.content),
    }));
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, personality } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Convert history to LangChain messages
    const messages = (history || []).map((msg: { role: string; content: string }) => {
      return msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content);
    });

    // Add the current user message
    messages.push(new HumanMessage(message));

    // Run the agent with the conversation history and personality
    const result = await agent.invoke(
      {
        messages,
      },
      {
        configurable: {
          personality: personality || "robot",
        },
      }
    );

    // Get the last AI message from the result
    const lastMessage = (result.messages as BaseMessage[])[(result.messages as BaseMessage[]).length - 1];
    const response = extractTextContent(lastMessage.content);

    // Extract executed nodes and filter to only include agent nodes (exclude infrastructure nodes)
    const executedNodes = (result as { executedNodes?: string[] }).executedNodes || [];
    const agentNodes = ["weather", "news", "general", "personality"];
    const agents = executedNodes.filter(node => agentNodes.includes(node));

    console.log("Executed nodes:", executedNodes);
    return NextResponse.json({
      response,
      history: extractHistory([...messages, lastMessage]),
      agents,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

