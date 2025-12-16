import express, { Response } from "express";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  getTripById,
  getActivitiesByDay,
  toggleActivityComplete
} from "../db/queries";
import { verifyToken, AuthRequest } from "../middleware/auth";
import { CreateActivityDto, UpdateActivityDto } from "../types";

const router = express.Router();

// All activity routes require authentication
router.use(verifyToken);

// Create activity
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const activityData: CreateActivityDto = req.body;

    // Validation
    if (!activityData.trip_id || !activityData.title || !activityData.day_number) {
      return res
        .status(400)
        .json({ error: "Trip ID,title & day number are required" });
    }
    
    // Verify user owns the trip
    const trip = await getTripById(activityData.trip_id, req.userId!);
    if (!trip) {
      return res
        .status(403)
        .json({ error: "Not authorized to add activities to this trip" });
    }

    const activity = await createActivity(activityData);
    res.status(201).json(activity);
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ error: "Failed to create activity" });
  }
});


// Get activities for specific day 
router.get("/trip/:tripId/day/:dayNumber", async (req: AuthRequest, res: Response) => {
try {
    const tripId = parseInt(req.params.tripId);
    const dayNumber = parseInt(req.params.dayNumber);

    // Verify ownership
    const trip = await getTripById(tripId, req.userId!);
    if (!trip) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const activities = await getActivitiesByDay(tripId, dayNumber);
    res.json(activities);
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }

});

// Toggle activity completion
router.patch("/:id/toggle", async (req: AuthRequest, res: Response) => {
  try {
    const activityId = parseInt(req.params.id);
    const activity = await toggleActivityComplete(activityId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Toggle activity error:", error);
    res.status(500).json({ error: "Failed to toggle activity" });
  }
});

// Update activity
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const activityId = parseInt(req.params.id);
    const updates: UpdateActivityDto = req.body;

    const activity = await updateActivity(activityId, updates);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({ error: "Failed to update activity" });
  }
});

// Delete activity
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const activityId = parseInt(req.params.id);

    const deleted = await deleteActivity(activityId);

    if (!deleted) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

export default router;