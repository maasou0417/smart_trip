import { useState, useEffect } from "react";
import { weatherAPI } from "../api/api";
import type { WeatherForecast, WeatherData } from "../types/weather";

interface UseWeatherResult {
  weather: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retrying: boolean;
}

export const useWeather = (
  destination: string,
  days: number = 7
): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);


  const fetchWeather = async (isRetry = false) => {
    // Do NOT fetch if no destination
    if (!destination || !destination.trim()) {
      setLoading(false);
      setWeather(null);
      setError(null);
      return;
    }

    if (isRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await weatherAPI.getForecast(destination, days);
      setWeather(data);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Weather Fetch Error: ", err);

      // Handle different error types 
      
      let errorMsg = "Weather data temporarily unavailable";

      if(err.response) {
        // Server responded with error
        if (err.response.status === 404) {
          errorMsg = `Weather not available for "${destination}"`;
        } else if (err.response.status === 429) {
          errorMsg = "Too many requests. Please try again in a moment.";
        } else if (err.response.status >= 500) {
          errorMsg = "Weather service temporarily down. Try again later.";
        } else {
          errorMsg = err.response.data?.error || errorMsg;
        }
      } else if (err.request) {
        // Request made but no response
        errorMsg = "Network error. Check your connection.";
      }

      setError(errorMsg);
      setWeather(null); // Clear old weather data on error
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [destination, days]);

  return {
    weather,
    loading,
    error,
    refetch: () => fetchWeather(true),
    retrying,
  };
};


// Hook for current weather ( SINGLE DAY )
export const useCurrentWeather = (destination: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchWeather = async (isRetry = false) => {
    if (!destination || !destination.trim()) {
      setLoading(false);
      setWeather(null);
      setError(null);
      return;
    }

    if (isRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await weatherAPI.getCurrent(destination);
      setWeather(data);
      setError(null);
    } catch (err: any) {
      console.error("Current weather error:", err );

      let errorMsg = "Current weather unavailable";

       if (err.response?.status === 404) {
        errorMsg = `Weather not found for "${destination}"`;
      } else if (err.response?.status === 429) {
        errorMsg = "Rate limit reached. Try again soon.";
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }


      setError(errorMsg);
      setWeather(null);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [destination]);

  return {
    weather,
    loading,
    error,
    refetch: () => fetchWeather(true),
    retrying,
  };
};