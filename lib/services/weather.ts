export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "WEATHER_API_KEY is not configured. " +
      "Get a free API key at https://weatherapi.com"
    );
  }

  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Location "${location}" not found. Please check the spelling.`);
      }
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your WEATHER_API_KEY.");
      }
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      location: `${data.location.name}, ${data.location.region}, ${data.location.country}`,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_mph,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch weather data. Please try again later.");
  }
}

