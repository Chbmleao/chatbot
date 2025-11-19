import { tool } from "langchain";
import { z } from "zod";
import { getWeatherData } from "@/lib/services/weather";

export const weatherTool = tool(
  async (input) => {
    try {
      const weather = await getWeatherData(input.location);
      
      let response = `Current weather in ${weather.location}: ${weather.condition} with a temperature of ${weather.temperature}°C.`;
      
      if (weather.humidity !== undefined) {
        response += ` Humidity: ${weather.humidity}%.`;
      }
      
      if (weather.windSpeed !== undefined) {
        response += ` Wind speed: ${weather.windSpeed} km/h.`;
      }
      
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching weather: ${error.message}`;
      }
      return "Error fetching weather data. Please try again later.";
    }
  },
  {
    name: "get_weather",
    description: "Get the current weather conditions for a specific location. Use this when users ask about weather, temperature, or climate conditions in a city or place.",
    schema: z.object({
      location: z
        .string()
        .describe("The city name or location to get weather for (e.g., 'San Francisco', 'Tokyo', 'New York')"),
    }),
  }
);

