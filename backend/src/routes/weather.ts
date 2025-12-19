
import express, { Request, Response } from "express";
import {
    getWeatherForDestination, 
    getCurrentWeather,
} from "../services/weatherService";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Get weather forecast for a destination
router.get("/forecast/:destination", async (req: Request, res: Response) => {
    try{
        const destination = decodeURIComponent(req.params.destination);
        const days = parseInt(req.query.days as string) || 7;

        console.log(`🌤️ Fetching weather for: ${destination} (${days} days)`);

        const weather = await getWeatherForDestination(destination, days);

        if ( !weather) {
            return res.status(404).json({
                error: "Weather data not availbale for this destination",
            });
        }

        res.json(weather);
    } catch (error) {
        console.error("Weather forecast route error:", error);
        res.status(500).json({ error: "Failed to fetch weather forecast" });
    }
});

// Get current weather for a destination
router.get("/current/:destination", async (req:Request, res:Response) => {
    try{
        const destination = decodeURIComponent(req.params.destination);

    console.log(`🌤️ Fetching current weather for: ${destination}`);

    const weather = await getCurrentWeather(destination);

    if (!weather) {
        return res.status(404).json({
            error: "Weather data not available for this destination",
        });
    }

    res.json(weather);
    } catch (error) {
        console.error("Current weather route error:", error);
        res.status(500).json({ error: "Failed to fetch current weather" });
    }
});

export default router;