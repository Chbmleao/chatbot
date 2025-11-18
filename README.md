# Character Chatbot with Personality

## Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Configure Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to your project settings → API
3. Copy your project URL and anon/public key
4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Features
- Have a unique persona (think witty pirate or sarcastic robot).
- Remember conversation history for context-aware replies.
- Use a multi-agent system with three specialized agents:
    - **Chat Agent**: Drives conversation and personality.
    - **Weather Agent**: Fetches real-time weather data.
    - **News Agent**: Delivers the latest news updates.
- Feature user authentication and a sleek UI.
- Be live on **Vercel** from Day 1, with daily updates.
- Be traced and debugged using **LangSmith** from the start.

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