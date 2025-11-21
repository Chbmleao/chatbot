"use client";

import { useState, useRef, useEffect } from "react";
import { LuMessageSquareText, LuTrash2, LuMic, LuMicOff } from "react-icons/lu";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  agents?: string[];
}

type Personality = "robot" | "pirate" | "wizard" | "supervillain";

interface PersonalityTheme {
  container: string;
  header: string;
  border: string;
  select: string;
  button: string;
  buttonHover: string;
  userMessage: string;
  assistantMessage: string;
  input: string;
  inputFocus: string;
  sendButton: string;
  sendButtonHover: string;
  loadingDots: string;
  emptyState: string;
  agentBadge: string;
  agentBadgeBorder: string;
  voiceButton: string;
  voiceButtonRecording: string;
  voiceButtonDisabled: string;
}

function getPersonalityTheme(personality: Personality): PersonalityTheme {
  const themes: Record<Personality, PersonalityTheme> = {
    robot: {
      container: "bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-950 border-gray-300 dark:border-gray-700",
      header: "bg-gray-100/50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700",
      border: "border-gray-300 dark:border-gray-700",
      select: "border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500 focus:border-gray-500",
      button: "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600",
      buttonHover: "hover:bg-gray-200 dark:hover:bg-gray-700",
      userMessage: "bg-gray-600 text-white shadow-lg shadow-gray-600/30",
      assistantMessage: "bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600",
      input: "border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-gray-500",
      inputFocus: "focus:ring-gray-500 focus:border-gray-500",
      sendButton: "bg-gray-600 hover:bg-gray-700 shadow-lg shadow-gray-600/30",
      sendButtonHover: "hover:bg-gray-700",
      loadingDots: "bg-gray-500",
      emptyState: "text-gray-600 dark:text-gray-400",
      agentBadge: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600",
      agentBadgeBorder: "border-gray-400 dark:border-gray-600",
      voiceButton: "bg-gray-500 hover:bg-gray-600 text-white",
      voiceButtonRecording: "bg-red-500 animate-pulse",
      voiceButtonDisabled: "bg-gray-400 cursor-not-allowed",
    },
    pirate: {
      container: "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950 dark:via-sky-950 dark:to-cyan-950 border-blue-400 dark:border-blue-800",
      header: "bg-blue-200/50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-800",
      border: "border-blue-400 dark:border-blue-800",
      select: "border-blue-500 dark:border-blue-700 bg-white dark:bg-blue-950 text-blue-800 dark:text-blue-300 focus:ring-blue-500 focus:border-blue-500",
      button: "text-blue-800 dark:text-blue-300 hover:bg-blue-300 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-blue-100 hover:border-blue-500 dark:hover:border-blue-600",
      buttonHover: "hover:bg-blue-300 dark:hover:bg-blue-800",
      userMessage: "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
      assistantMessage: "bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900 dark:to-sky-900 text-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700",
      input: "border-blue-500 dark:border-blue-700 bg-white dark:bg-blue-950 focus:ring-blue-500",
      inputFocus: "focus:ring-blue-500 focus:border-blue-500",
      sendButton: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30",
      sendButtonHover: "hover:bg-blue-700",
      loadingDots: "bg-blue-500",
      emptyState: "text-blue-700 dark:text-blue-400",
      agentBadge: "bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500 dark:border-blue-700",
      agentBadgeBorder: "border-blue-500 dark:border-blue-700",
      voiceButton: "bg-blue-500 hover:bg-blue-600 text-white",
      voiceButtonRecording: "bg-red-500 animate-pulse",
      voiceButtonDisabled: "bg-blue-400 cursor-not-allowed",
    },
    wizard: {
      container: "bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950 dark:via-indigo-950 dark:to-blue-950 border-purple-300 dark:border-purple-800",
      header: "bg-purple-200/50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-800",
      border: "border-purple-300 dark:border-purple-800",
      select: "border-purple-400 dark:border-purple-700 bg-white dark:bg-purple-950 text-purple-700 dark:text-purple-300 focus:ring-purple-500 focus:border-purple-500",
      button: "text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 hover:text-purple-900 dark:hover:text-purple-100 hover:border-purple-400 dark:hover:border-purple-600",
      buttonHover: "hover:bg-purple-200 dark:hover:bg-purple-800",
      userMessage: "bg-purple-600 text-white shadow-lg shadow-purple-600/30",
      assistantMessage: "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-purple-700",
      input: "border-purple-400 dark:border-purple-700 bg-white dark:bg-purple-950 focus:ring-purple-500",
      inputFocus: "focus:ring-purple-500 focus:border-purple-500",
      sendButton: "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30",
      sendButtonHover: "hover:bg-purple-700",
      loadingDots: "bg-purple-400",
      emptyState: "text-purple-600 dark:text-purple-400",
      agentBadge: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-400 dark:border-purple-700",
      agentBadgeBorder: "border-purple-400 dark:border-purple-700",
      voiceButton: "bg-purple-500 hover:bg-purple-600 text-white",
      voiceButtonRecording: "bg-red-500 animate-pulse",
      voiceButtonDisabled: "bg-purple-400 cursor-not-allowed",
    },
    supervillain: {
      container: "bg-gradient-to-br from-red-950 via-gray-900 to-black dark:from-black dark:via-red-950 dark:to-gray-900 border-red-800 dark:border-red-900",
      header: "bg-red-900/30 dark:bg-red-950/50 border-red-800 dark:border-red-900",
      border: "border-red-800 dark:border-red-900",
      select: "border-red-700 dark:border-red-800 bg-gray-900 dark:bg-black text-red-400 dark:text-red-500 focus:ring-red-600 focus:border-red-600",
      button: "text-red-400 dark:text-red-500 hover:bg-red-900/50 dark:hover:bg-red-950 hover:text-red-300 dark:hover:text-red-400 hover:border-red-600 dark:hover:border-red-700",
      buttonHover: "hover:bg-red-900/50 dark:hover:bg-red-950",
      userMessage: "bg-red-700 text-white shadow-lg shadow-red-700/50",
      assistantMessage: "bg-gradient-to-br from-gray-800 to-red-950 dark:from-black dark:to-red-950 text-red-100 dark:text-red-300 border border-red-800 dark:border-red-900",
      input: "border-red-800 dark:border-red-900 bg-gray-900 dark:bg-black text-red-100 dark:text-red-300 focus:ring-red-600",
      inputFocus: "focus:ring-red-600 focus:border-red-600",
      sendButton: "bg-red-700 hover:bg-red-800 shadow-lg shadow-red-700/50",
      sendButtonHover: "hover:bg-red-800",
      loadingDots: "bg-red-500",
      emptyState: "text-red-500 dark:text-red-400",
      agentBadge: "bg-red-700/30 text-red-300 dark:text-red-400 border-red-600 dark:border-red-700",
      agentBadgeBorder: "border-red-600 dark:border-red-700",
      voiceButton: "bg-red-600 hover:bg-red-700 text-white",
      voiceButtonRecording: "bg-red-700 animate-pulse",
      voiceButtonDisabled: "bg-red-800 cursor-not-allowed",
    },
  };

  return themes[personality];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<Personality>("robot");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = getPersonalityTheme(personality);

  // Voice input hook
  const { isRecording, isSupported, toggleRecording } = useVoiceInput({
    onTranscript: (transcript) => {
      setInput(transcript);
    },
    onInterimTranscript: (interimTranscript) => {
      setInput(interimTranscript);
    },
  });

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
      return { response: data.response, agents: data.agents || [] };
    } catch (error) {
      console.error("Error:", error);
      return { response: "Sorry, I encountered an error. Please try again.", agents: [] };
    }
  }

  const handleSummarizeChat = async () => {
    const userMessage: Message = { role: "user", content: "Summarize the conversation so far." };
    setIsLoading(true);
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const result = await getChatResponse(userMessage.content);
    setMessages([...newMessages, { role: "assistant", content: result.response, agents: result.agents }]);
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

    const result = await getChatResponse(input);
    setMessages([...newMessages, { role: "assistant", content: result.response, agents: result.agents }]);

    setIsLoading(false);
  };

  return (
    <div className={`flex flex-col h-full max-h-[600px] w-full max-w-2xl mx-auto rounded-lg shadow-lg border-2 transition-all duration-300 ${theme.container}`}>
      {/* Header with buttons */}
      <div className={`flex items-center justify-between gap-3 p-3 border-b-2 transition-all duration-300 ${theme.header} ${theme.border}`}>
        {/* Dropdown to select model personality */}
        <select
          className={`px-3 py-1.5 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${theme.select}`}
          value={personality}
          onChange={(e) => setPersonality(e.target.value as Personality)}
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
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer border-2 border-transparent ${theme.button}`}
            >
              <LuTrash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
            <button
              onClick={handleSummarizeChat}
              disabled={isLoading}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer border-2 border-transparent ${theme.button}`}
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
          <div className={`text-center py-8 ${theme.emptyState}`}>
            <p className="text-lg font-medium">Start a conversation!</p>
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
              className={`max-w-[80%] rounded-lg px-4 py-2 transition-all duration-200 ${
                message.role === "user"
                  ? theme.userMessage
                  : theme.assistantMessage
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.role === "assistant" && message.agents && message.agents.length > 0 && (
                <div className={`flex flex-wrap gap-1.5 mt-2 pt-2 border-t ${theme.agentBadgeBorder}`}>
                  {message.agents.map((agent, agentIndex) => (
                    <span
                      key={agentIndex}
                      className={`text-xs px-2 py-0.5 rounded-full border ${theme.agentBadge} font-medium capitalize`}
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`${theme.assistantMessage} rounded-lg px-4 py-2`}>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 ${theme.loadingDots} rounded-full animate-bounce`}></div>
                <div className={`w-2 h-2 ${theme.loadingDots} rounded-full animate-bounce`} style={{ animationDelay: "0.1s" }}></div>
                <div className={`w-2 h-2 ${theme.loadingDots} rounded-full animate-bounce`} style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className={`border-t-2 p-4 transition-all duration-300 ${theme.border}`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${theme.input} ${theme.inputFocus}`}
            disabled={isLoading}
          />
          {isSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer ${
                isRecording ? theme.voiceButtonRecording : isLoading ? theme.voiceButtonDisabled : theme.voiceButton
              }`}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <LuMic className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer ${theme.sendButton} ${theme.sendButtonHover}`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

