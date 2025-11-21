"use client";

import { useState, useRef, useEffect } from "react";
import { LuMessageSquareText, LuTrash2 } from "react-icons/lu";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState("robot");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
  };

  const getChatResponse = async (message: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          history: messages,
          personality: personality,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, I encountered an error. Please try again.";
    }
  }

  const handleSummarizeChat = async () => {
    const userMessage: Message = { role: "user", content: "Summarize the conversation so far." };
    setIsLoading(true);
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const response = await getChatResponse(userMessage.content);
    setMessages([...newMessages, { role: "assistant", content: response }]);
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const response = await getChatResponse(input);
    setMessages([...newMessages, { role: "assistant", content: response }]);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
      {/* Header with buttons */}
      <div className="flex items-center justify-between gap-3 p-3 border-b border-zinc-200 dark:border-zinc-800">
        {/* Dropdown to select model personality */}
        <select
          className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          disabled={isLoading}
        >
          <option value="robot">Robot 🤖</option>
          <option value="pirate">Pirate 🏴‍☠️</option>
          <option value="wizard">Wizard 🧙‍♂️</option>
          <option value="supervillain">Supervillain 🦹‍♂️</option>
        </select>

        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <LuTrash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
            <button
              onClick={handleSummarizeChat}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <LuMessageSquareText className="w-4 h-4" />
              <span>Summarize Chat</span>
            </button>
          </div>
        )}
      </div>
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            <p className="text-lg">Start a conversation!</p>
            <p className="text-sm mt-2">Ask me anything and I'll respond using AI.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

