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
4. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
5. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Features
- **LangGraph Chat Agent**: Simple chat agent that maintains conversation history in its state
- **ChatGPT Integration**: Uses OpenAI's GPT models (gpt-4o-mini by default) for responses
- **Conversation History**: Automatically stores and uses conversation context for context-aware replies
- **User Authentication**: Secure authentication via Supabase
- **Modern UI**: Clean, responsive chat interface with dark mode support
- Future features:
  - Multi-agent system with specialized agents (Weather, News, etc.)
  - LangSmith tracing and debugging
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