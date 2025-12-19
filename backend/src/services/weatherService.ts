import axios from "axios";
import type { WeatherData, WeatherForecast, GeocodingResult } from "../types/weather";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

if (!OPENWEATHER_API_KEY) {
  console.warn("⚠️ OPENWEATHER_API_KEY not set in environment variables");
}

// Get coordinates for a city/destination
export const getCoordinates = async (
  destination: string
): Promise<GeocodingResult | null> => {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: destination,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    });

    if (response.data.length === 0) {
      console.log(`❌ No coordinates found for: ${destination}`);
      return null;
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
    console.error("Geocoding error:", error);
    return null;
  }
};

// Get weather forecast for coordinates
export const getWeatherForecast = async (
  lat: number,
  lon: number,
  days: number = 7
): Promise<WeatherData[]> => {
  try {
    // Use 5 day / 3 hour forecast (free tier)
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: "metric", // Celsius
        cnt: Math.min(days * 8, 40), // Max 40 items (5 days)
      },
    });

    // Group by date and get one forecast per day (noon)
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
    const forecast: WeatherData[] = Object.values(forecastByDate).map(
      (item: any) => ({
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
        rain: item.rain?.["3h"],
        snow: item.snow?.["3h"],
      })
    );

    return forecast.slice(0, days);
  } catch (error) {
    console.error("Weather forecast error:", error);
    throw new Error("Failed to fetch weather forecast");
  }
};

// Get weather forecast for a destination
export const getWeatherForDestination = async (
  destination: string,
  days: number = 7
): Promise<WeatherForecast | null> => {
  try {
    // Step 1: Get coordinates
    const coords = await getCoordinates(destination);
    if (!coords) {
      return null;
    }

    // Step 2: Get forecast
    const forecast = await getWeatherForecast(coords.lat, coords.lon, days);

    return {
      city: coords.name,
      country: coords.country,
      forecast,
    };
  } catch (error) {
    console.error("Weather service error:", error);
    return null;
  }
};

// Get current weather for destination
export const getCurrentWeather = async (
  destination: string
): Promise<WeatherData | null> => {
  try {
    const coords = await getCoordinates(destination);
    if (!coords) return null;

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

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
      rain: data.rain?.["1h"],
      snow: data.snow?.["1h"],
    };
  } catch (error) {
    console.error("Current weather error:", error);
    return null;
  }
};