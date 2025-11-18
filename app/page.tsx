import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-8 px-4 sm:px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between mb-6">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <AuthButton />
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-8">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to your Chatbot
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your chatbot with LangGraph is ready. Start chatting to experience
            conversation history and AI-powered responses.
          </p>
        </div>
        <div className="w-full flex-1">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
