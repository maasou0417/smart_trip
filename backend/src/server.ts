import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { apiLimiter } from "./middleware/rateLimiter";

// Routes
import authRoutes from "./routes/auth";
import tripRoutes from "./routes/trips";
import activityRoutes from "./routes/activities";
import itineraryRoutes from "./routes/itinerary";
import weatherRoutes from "./routes/weather";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use("/api/", apiLimiter);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    message: "✅ Smart Trip API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/weather", weatherRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});