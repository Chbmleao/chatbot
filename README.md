# Character Chatbot with Personality

## Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @langchain/langgraph @langchain/google-genai langchain
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

## Testing Conversation Memory

To verify that the chatbot remembers past messages:

1. Start a conversation and ask: "My name is Alice"
2. In a follow-up message, ask: "What's my name?"
3. The bot should respond with "Alice" or reference your earlier message

The conversation history is maintained in the LangGraph state and passed to the LLM with each request, allowing the bot to recall previous messages in the conversation.

## Deployment to Vercel

### Prerequisites
- A GitHub account
- A Vercel account (free tier available)

### Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Chatbot with LangGraph and Supabase"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `GOOGLE_API_KEY`
     - `LANGCHAIN_TRACING_V2` (optional)
     - `LANGCHAIN_API_KEY` (optional)
     - `LANGCHAIN_PROJECT` (optional)
   - Click "Deploy"

3. **Verify Deployment**:
   - Visit your live URL (e.g., `https://your-project.vercel.app`)
   - Log in with Supabase authentication
   - Test the chatbot and verify conversation memory works
   - Check LangSmith dashboard for traces (if configured)

## Tools
- **Next.js**: Build the app's frontend.
- **Supabase**: Handle authentication and data storage.
- **LangGraph**: Power the chatbot logic with state management.
- **Google Gemini**: LLM for generating responses.
- **LangSmith**: Trace and debug LLM interactions.
- **Vercel**: Host your live app.
- **GitHub**: Track your progress with daily commits.