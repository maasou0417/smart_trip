import express, { Response } from "express";
import { getTripItinerary, getActivityStats } from "../db/queries";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = express.Router();
router.use(verifyToken);

// Get full itinerary for a trip
router.get("/:tripId", async (req: AuthRequest, res: Response) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const itinerary = await getTripItinerary(tripId, req.userId!);

    if (!itinerary) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(itinerary);
  } catch (error) {
    console.error("Get itinerary error:", error);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

// Get activity statistics for a trip
router.get("/:tripId/stats", async (req: AuthRequest, res: Response) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const stats = await getActivityStats(tripId);
    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;