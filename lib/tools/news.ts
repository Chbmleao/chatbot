import { tool } from "langchain";
import { z } from "zod";
import { getNewsData } from "@/lib/services/news";

export const newsTool = tool(
    async (input) => {
        try {
            const news = await getNewsData(input.country || "us", input.category || "", input.pageSize || 10);

            return news.map((article) => `
                ${article.title} - ${article.source}
                ${article.description}
                ${article.url}
            `).join("\n\n");
        } catch (error) {
            if (error instanceof Error) {
                return `Error fetching news: ${error.message}`;
            }
            return "Error fetching news data. Please try again later.";
        }
    },
    {
        name: "get_news",
        description: `
      Use this tool whenever the user asks for recent news, current events, headlines, or articles.
      You can filter by country and/or category if the user specifies a location (e.g. "news in Japan") or topic (e.g. "latest AI news").
      If no country or category is mentioned, fetch general/top headlines for the user's likely location or global news.
        `.trim(),
      
        schema: z.object({
          country: z
            .string()
            .length(2)
            .optional()
            .describe(
              "2-letter ISO 3166-1 alpha-2 country code (lowercase). Examples: 'us' (USA), 'gb' (UK), 'jp' (Japan), 'in' (India), 'de' (Germany), 'fr' (France), 'br' (Brazil). Only use if the user clearly wants news from a specific country."
            ),
      
          category: z
            .enum([
              "business",
              "entertainment",
              "general",
              "health",
              "science",
              "sports",
              "technology",
            ])
            .optional()
            .describe(
              "News category. Only use one of these exact values if the user mentions a specific topic. If unsure or not mentioned, omit this field (defaults to general/top headlines)."
            ),
      
          pageSize: z
            .number()
            .int()
            .min(1)
            .max(20)
            .optional()
            .default(10)
            .describe(
              "Number of articles to return. Use 5–10 for quick summaries, up to 20 if the user wants 'more' news. Never exceed 20."
            ),
        }),
      }
);

