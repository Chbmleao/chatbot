# AI Chatbot with Tools

A Next.js chatbot powered by LangChain's `createAgent` with tool capabilities for weather and news queries.

## Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @langchain/langgraph @langchain/google-genai langchain zod
```

### 2. Configure Environment Variables

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to your project settings → API
3. Copy your project URL and anon/public key
4. Get your Google API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
5. Get a free Weather API key from [WeatherAPI.com](https://www.weatherapi.com/)
6. Get a free News API key from [NewsAPI.org](https://newsapi.org/)
7. (Optional) Set up LangSmith for tracing:
   - Sign up at [LangSmith](https://smith.langchain.com)
   - Go to Settings → API Keys
   - Create an API key
8. Create a `.env.local` file in the root directory:
   - Copy `.env.example` to `.env.local`: `cp .env.example .env.local`
   - Fill in your actual API keys and values

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `GOOGLE_API_KEY` - Google Gemini API key
- `WEATHER_API_KEY` - WeatherAPI.com API key
- `NEWS_API_KEY` - NewsAPI.org API key

**Optional Environment Variables:**
- `LANGCHAIN_TRACING_V2` - Set to "true" to enable LangSmith tracing
- `LANGCHAIN_API_KEY` - Your LangSmith API key
- `LANGCHAIN_PROJECT` - Project name for LangSmith traces

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Features

### Core Features
- **LangChain Agent**: Uses `createAgent` from LangChain for powerful agent capabilities
- **Google Gemini Integration**: Uses Google's Gemini models (gemini-2.5-flash by default) for responses
- **Conversation History**: Automatically stores and uses conversation context for context-aware replies
- **Tool System**: Modular tool architecture allowing the agent to perform actions
- **User Authentication**: Secure authentication via Supabase
- **Modern UI**: Clean, responsive chat interface with dark mode support

### Available Tools

#### Weather Tool
The agent can fetch current weather information for any location:
- Ask: "What's the weather in Belo Horizonte?"
- Ask: "How's the temperature in Tokyo?"
- The tool uses [WeatherAPI.com](https://www.weatherapi.com/) to get real-time weather data

#### News Tool
The agent can fetch recent news articles:
- Ask: "What's the latest news?"
- Ask: "Show me technology news from Brazil"
- Ask: "Get me 5 sports headlines"
- The tool uses [NewsAPI.org](https://newsapi.org/) and supports:
  - Country filtering (2-letter ISO code)
  - Category filtering (business, entertainment, general, health, science, sports, technology)
  - Customizable number of articles (1-20)

### Architecture

The project follows a clean separation of concerns:

```
lib/
├── agent/
│   └── chat-agent.ts      # Agent configuration using createAgent
├── services/              # External API integrations
│   ├── weather.ts         # Weather API service
│   └── news.ts            # News API service
└── tools/                 # LangChain tool definitions
    ├── weather.ts         # Weather tool for the agent
    └── news.ts            # News tool for the agent
```

**Best Practices:**
- **Services** (`lib/services/`): Handle external API calls, error handling, and data transformation
- **Tools** (`lib/tools/`): Define LangChain tools with schemas and descriptions for the LLM
- **Agent** (`lib/agent/`): Configure the agent with model and tools

### LangSmith Tracing

When LangSmith is configured, all conversations are automatically traced. This includes:
- **LLM Calls**: Input prompts, responses, token usage, and latency
- **Tool Executions**: Tool calls, arguments, and results
- **Agent State**: State transitions and message flow
- **Errors**: Full error traces and debugging information
- **Performance Metrics**: Response times and token costs

View your traces at [LangSmith Dashboard](https://smith.langchain.com) under the project name specified in `LANGCHAIN_PROJECT`.

## Testing the Chatbot

### Testing Conversation Memory

To verify that the chatbot remembers past messages:

1. Start a conversation and ask: "My name is Alice"
2. In a follow-up message, ask: "What's my name?"
3. The bot should respond with "Alice" or reference your earlier message

The conversation history is maintained and passed to the LLM with each request, allowing the bot to recall previous messages in the conversation.

### Testing Tools

**Weather Tool:**
```
User: "What's the weather in San Francisco?"
Bot: [Calls weather tool and returns current conditions]
```

**News Tool:**
```
User: "Show me the latest technology news"
Bot: [Calls news tool and returns recent tech articles]

User: "Get me 5 sports headlines from Brazil"
Bot: [Calls news tool with country=br, category=sports, pageSize=5]
```

The agent automatically decides when to use tools based on user queries. You don't need to explicitly request tool usage.

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
     - `WEATHER_API_KEY`
     - `NEWS_API_KEY`
     - `LANGCHAIN_TRACING_V2` (optional)
     - `LANGCHAIN_API_KEY` (optional)
     - `LANGCHAIN_PROJECT` (optional)
   - Click "Deploy"

3. **Verify Deployment**:
   - Visit your live URL (e.g., `https://your-project.vercel.app`)
   - Log in with Supabase authentication
   - Test the chatbot and verify conversation memory works
   - Check LangSmith dashboard for traces (if configured)

## Tech Stack

### Core Technologies
- **Next.js 16**: React framework for building the app
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling with dark mode support

### AI & Agent Framework
- **LangChain**: Agent framework and tool system
- **createAgent**: Modern agent creation API from LangChain
- **Google Gemini**: LLM for generating responses (gemini-2.5-flash)
- **LangGraph**: State management and agent orchestration

### External Services
- **Supabase**: Authentication and data storage
- **WeatherAPI.com**: Real-time weather data
- **NewsAPI.org**: News articles and headlines
- **LangSmith**: Tracing and debugging (optional)

### Deployment
- **Vercel**: Host your live app
- **GitHub**: Version control and CI/CD

## Adding New Tools

To add a new tool to the agent:

1. **Create a service** in `lib/services/`:
   ```typescript
   // lib/services/example.ts
   export async function getExampleData(input: string) {
     // API call logic here
   }
   ```

2. **Create a tool** in `lib/tools/`:
   ```typescript
   // lib/tools/example.ts
   import { tool } from "langchain";
   import { z } from "zod";
   import { getExampleData } from "@/lib/services/example";
   
   export const exampleTool = tool(
     async (input) => {
       const data = await getExampleData(input.query);
       return data;
     },
     {
       name: "example_tool",
       description: "Clear description of when to use this tool",
       schema: z.object({
         query: z.string().describe("Input description"),
       }),
     }
   );
   ```

3. **Add to agent** in `lib/agent/chat-agent.ts`:
   ```typescript
   import { exampleTool } from "@/lib/tools/example";
   
   // In createChatAgent():
   tools: [weatherTool, newsTool, exampleTool],
   ```

## Contributing

This is a learning project demonstrating:
- LangChain agent creation with tools
- Modular architecture for services and tools
- Type-safe API integrations
- Next.js API routes for agent execution