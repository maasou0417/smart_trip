import { useState, useEffect } from "react";
import { weatherAPI } from "../api/api";
import type { WeatherForecast, WeatherData } from "../types/weather";

interface UseWeatherResult {
  weather: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWeather = (
  destination: string,
  days: number = 7
): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!destination) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await weatherAPI.getForecast(destination, days);
      setWeather(data);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        "Failed to fetch weather data. Weather may not be available for this destination.";
      setError(errorMsg);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [destination, days]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  };
};

// Hook for current weather
export const useCurrentWeather = (destination: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!destination) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await weatherAPI.getCurrent(destination);
      setWeather(data);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to fetch current weather";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [destination]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  };
};