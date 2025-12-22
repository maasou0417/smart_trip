import express, { Request, Response } from "express";
import {
  getWeatherForDestination,
  getCurrentWeather,
  WeatherServiceError,
} from "../services/weatherService";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Get weather forecast for a destination
router.get("/forecast/:destination", async (req: Request, res: Response) => {
  try {
    // Decode and validate destination
    const destination = decodeURIComponent(req.params.destination);

    if (!destination || destination.trim().length === 0) {
      return res.status(400).json({
        error: "Destination parameter is required",
      });
    }

    // Parse days parameter (no maximum limit on the API side)
    const daysParam = req.query.days as string;
    let days = 5; // Default

    if (daysParam) {
      const parsedDays = parseInt(daysParam, 10);

      if (isNaN(parsedDays)) {
        return res.status(400).json({
          error: "Days parameter must be a valid number",
        });
      }

      if (parsedDays < 1) {
        return res.status(400).json({
          error: "Days must be at least 1",
        });
      }

      // Accept any positive number, service will return what's available
      days = parsedDays;
    }

    console.log(`🌤️ Fetching weather for: ${destination} (${days} days requested)`);

    const weather = await getWeatherForDestination(destination, days);

    // If user requested more than available, add a helpful message
    if (days > 5 && weather.forecast.length <= 5) {
      res.json({
        ...weather,
        message: `Only ${weather.forecast.length} days of forecast data available (OpenWeather free tier limit). Weather data will be shown for the first ${weather.forecast.length} days of your trip.`,
      });
    } else {
      res.json(weather);
    }
  } catch (error) {
    console.error("Weather forecast route error:", error);

    // Handle custom weather service errors
    if (error instanceof WeatherServiceError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    // Handle unexpected errors
    res.status(500).json({
      error: "An unexpected error occurred while fetching weather data",
    });
  }
});

// Get current weather for a destination
router.get("/current/:destination", async (req: Request, res: Response) => {
  try {
    // Decode and validate destination
    const destination = decodeURIComponent(req.params.destination);

    if (!destination || destination.trim().length === 0) {
      return res.status(400).json({
        error: "Destination parameter is required",
      });
    }

    console.log(`🌤️ Fetching current weather for: ${destination}`);

    const weather = await getCurrentWeather(destination);

    res.json(weather);
  } catch (error) {
    console.error("Current weather route error:", error);

    // Handle custom weather service errors
    if (error instanceof WeatherServiceError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    // Handle unexpected errors
    res.status(500).json({
      error: "An unexpected error occurred while fetching weather data",
    });
  }
});

export default router;