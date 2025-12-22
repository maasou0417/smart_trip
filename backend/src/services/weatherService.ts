import axios, { AxiosError } from "axios";
import type { WeatherData, WeatherForecast, GeocodingResult } from "../types/weather";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// Maximum days available from OpenWeather free tier
const MAX_FORECAST_DAYS = 5;

// Validate API key on startup
if (!OPENWEATHER_API_KEY) {
  console.error("❌ CRITICAL: OPENWEATHER_API_KEY not set in environment variables");
  console.error("   Weather features will be disabled.");
}

// Custom error class for weather service
export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "WeatherServiceError";
  }
}

// Axios config with timeout
const axiosConfig = {
  timeout: 10000, // 10 seconds
};

// Handle axios errors consistently
const handleAxiosError = (error: any, context: string): never => {
  console.error(`${context} error:`, error.message);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Network/timeout errors
    if (axiosError.code === "ECONNABORTED") {
      throw new WeatherServiceError(
        "Weather service timeout. Please try again.",
        504
      );
    }

    if (!axiosError.response) {
      throw new WeatherServiceError(
        "Cannot connect to weather service. Check your internet connection.",
        503
      );
    }

    // API-specific errors
    const status = axiosError.response.status;
    const data: any = axiosError.response.data;

    if (status === 401) {
      console.error("❌ Invalid OpenWeather API key");
      throw new WeatherServiceError(
        "Weather service configuration error",
        500,
        false // Not operational - needs admin fix
      );
    }

    if (status === 404) {
      throw new WeatherServiceError(
        "Location not found. Please check the destination name.",
        404
      );
    }

    if (status === 429) {
      throw new WeatherServiceError(
        "Weather service rate limit exceeded. Try again in a few minutes.",
        429
      );
    }

    if (status >= 500) {
      throw new WeatherServiceError(
        "Weather service temporarily unavailable. Try again later.",
        503
      );
    }

    // Other API errors
    throw new WeatherServiceError(
      data?.message || "Failed to fetch weather data",
      status
    );
  }

  // Unknown error
  throw new WeatherServiceError(
    "Unexpected error fetching weather data",
    500
  );
};

// Validate input
const validateDestination = (destination: string): void => {
  if (!destination || typeof destination !== "string") {
    throw new WeatherServiceError("Destination is required", 400);
  }

  const trimmed = destination.trim();
  if (trimmed.length === 0) {
    throw new WeatherServiceError("Destination cannot be empty", 400);
  }

  if (trimmed.length < 2) {
    throw new WeatherServiceError("Destination name too short", 400);
  }

  if (trimmed.length > 100) {
    throw new WeatherServiceError("Destination name too long", 400);
  }
};

const validateDays = (days: number): void => {
  if (!Number.isInteger(days) || days < 1) {
    throw new WeatherServiceError("Days must be a positive integer", 400);
  }

  // No max limit - we'll just return what's available
};

// Get coordinates for a city/destination
export const getCoordinates = async (
  destination: string
): Promise<GeocodingResult> => {
  validateDestination(destination);

  if (!OPENWEATHER_API_KEY) {
    throw new WeatherServiceError(
      "Weather service not configured",
      503,
      false
    );
  }

  try {
    const response = await axios.get(
      `${GEO_URL}/direct`,
      {
        ...axiosConfig,
        params: {
          q: destination.trim(),
          limit: 1,
          appid: OPENWEATHER_API_KEY,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new WeatherServiceError(
        `Location "${destination}" not found. Try a different name or add country code (e.g., "Paris, FR")`,
        404
      );
    }

    const data = response.data[0];
    return {
      name: data.name,
      lat: data.lat,
      lon: data.lon,
      country: data.country,
      state: data.state,
    };
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    throw handleAxiosError(error, "Geocoding");
  }
};

// Get weather forecast for coordinates
export const getWeatherForecast = async (
  lat: number,
  lon: number,
  requestedDays: number = 5
): Promise<WeatherData[]> => {
  validateDays(requestedDays);

  if (!OPENWEATHER_API_KEY) {
    throw new WeatherServiceError(
      "Weather service not configured",
      503,
      false
    );
  }

  try {
    // OpenWeather free tier supports max 5 days
    // We'll fetch what's available, but not fail if user requests more
    const daysToFetch = Math.min(requestedDays, MAX_FORECAST_DAYS);

    console.log(`📅 Requesting ${requestedDays} days, fetching ${daysToFetch} (API limit: ${MAX_FORECAST_DAYS})`);

    // Use 5 day / 3 hour forecast (free tier)
    const response = await axios.get(
      `${BASE_URL}/forecast`,
      {
        ...axiosConfig,
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric", // Celsius
          cnt: 40, // Get all available data points (5 days = 40 points at 3-hour intervals)
        },
      }
    );

    if (!response.data || !response.data.list) {
      throw new WeatherServiceError("Invalid weather data received", 500);
    }

    // Group by date and get one forecast per day (prefer noon)
    const forecastByDate: { [key: string]: any } = {};

    response.data.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0]; // "2024-12-01"
      const hour = item.dt_txt.split(" ")[1].split(":")[0]; // "12"

      // Prefer noon forecasts (most accurate for daily weather)
      if (!forecastByDate[date] || hour === "12") {
        forecastByDate[date] = item;
      }
    });

    // Convert to WeatherData array
    const forecast  = Object.values(forecastByDate)
      .map((item: any): WeatherData | null  => {
        try {
          return {
            date: item.dt_txt.split(" ")[0],
            temp: Math.round(item.main.temp),
            temp_min: Math.round(item.main.temp_min),
            temp_max: Math.round(item.main.temp_max),
            feels_like: Math.round(item.main.feels_like),
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            wind_speed: item.wind.speed,
            clouds: item.clouds.all,
            rain: item.rain?.["3h"] || 0,
            snow: item.snow?.["3h"] || 0,
          };
        } catch (err) {
          console.error("Error parsing weather item:", err);
          return null;
        }
      })

      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (forecast.length === 0) {
      throw new WeatherServiceError("No valid weather data available", 500);
    }

    // Return what we have (up to 5 days)
    console.log(`✅ Returning ${forecast.length} days of weather data`);
    return forecast;
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    throw handleAxiosError(error, "Weather forecast");
  }
};

// Get weather forecast for a destination
export const getWeatherForDestination = async (
  destination: string,
  requestedDays: number = 5
): Promise<WeatherForecast> => {
  try {
    // Step 1: Get coordinates
    const coords = await getCoordinates(destination);

    // Step 2: Get forecast (returns up to 5 days)
    const forecast = await getWeatherForecast(coords.lat, coords.lon, requestedDays);

    // Add a note if requested days exceed available data
    const availableDays = forecast.length;
    const note = requestedDays > MAX_FORECAST_DAYS 
      ? `Weather forecast limited to ${availableDays} days (OpenWeather free tier)` 
      : undefined;

    return {
      city: coords.name,
      country: coords.country,
      forecast,
      ...(note && { note }), // Add note if applicable
    };
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    console.error("Weather service error:", error);
    throw new WeatherServiceError("Failed to fetch weather data", 500);
  }
};

// Get current weather for destination
export const getCurrentWeather = async (
  destination: string
): Promise<WeatherData> => {
  validateDestination(destination);

  if (!OPENWEATHER_API_KEY) {
    throw new WeatherServiceError(
      "Weather service not configured",
      503,
      false
    );
  }

  try {
    const coords = await getCoordinates(destination);

    const response = await axios.get(
      `${BASE_URL}/weather`,
      {
        ...axiosConfig,
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    if (!response.data || !response.data.main || !response.data.weather) {
      throw new WeatherServiceError("Invalid weather data received", 500);
    }

    const data = response.data;
    return {
      date: new Date().toISOString().split("T")[0],
      temp: Math.round(data.main.temp),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      clouds: data.clouds.all,
      rain: data.rain?.["1h"] || 0,
      snow: data.snow?.["1h"] || 0,
    };
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    throw handleAxiosError(error, "Current weather");
  }
};