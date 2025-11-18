# Character Chatbot with Personality

## Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @langchain/langgraph @langchain/openai langchain
```

### 2. Configure Environment Variables

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to your project settings → API
3. Copy your project URL and anon/public key
4. Get your Google API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
5. (Optional) Set up LangSmith for tracing:
   - Sign up at [LangSmith](https://smith.langchain.com)
   - Go to Settings → API Keys
   - Create an API key
6. Create a `.env.local` file in the root directory:
   - Copy `.env.example` to `.env.local`: `cp .env.example .env.local`
   - Fill in your actual API keys and values

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### LangSmith Tracing

When LangSmith is configured, all conversations are automatically traced. This includes:
- **LLM Calls**: Input prompts, responses, token usage, and latency
- **LangGraph State**: State transitions and node executions
- **Errors**: Full error traces and debugging information
- **Performance Metrics**: Response times and token costs

View your traces at [LangSmith Dashboard](https://smith.langchain.com) under the project name specified in `LANGCHAIN_PROJECT`.

## Features
- **LangGraph Chat Agent**: Simple chat agent that maintains conversation history in its state
- **Google Gemini Integration**: Uses Google's Gemini models (gemini-2.5-flash by default) for responses
- **Conversation History**: Automatically stores and uses conversation context for context-aware replies
- **LangSmith Tracing**: All LLM calls and LangGraph state transitions are automatically traced (when configured)
- **User Authentication**: Secure authentication via Supabase
- **Modern UI**: Clean, responsive chat interface with dark mode support
- Future features:
  - Multi-agent system with specialized agents (Weather, News, etc.)
  - Live deployment on Vercel

## Tools
- **Next.js**: Build the app’s frontend.
- **Supabase**: Handle authentication and data storage.
- **LangGraph**: Power the multi-agent chatbot logic.
- **LangSmith**: Trace and debug LLM interactions.
- **Vercel AI SDK**: Add pre-built AI UI components.
- **Vercel**: Host your live app.
- **GitHub**: Track your progress with daily commits.
- **Cursor:** This is the IDE we will use (agent-mode)
- **Grok-3:** Use for system design and getting a deep understanding of concepts