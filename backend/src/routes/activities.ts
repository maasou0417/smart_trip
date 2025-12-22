import express, { Response } from "express";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  getTripById,
  getActivitiesByDay,
  toggleActivityComplete,
  getActivityById,
} from "../db/queries";
import { verifyToken, AuthRequest } from "../middleware/auth";
import { CreateActivityDto, UpdateActivityDto } from "../types";

const router = express.Router();

// All activity routes require authentication
router.use(verifyToken);

// Helper: Validate integer ID
const validateId = (id: string, fieldName: string): number => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed < 1) {
    throw new Error(`Invalid ${fieldName}: must be a positive integer`);
  }
  return parsed;
};

// Helper: Verify user owns the trip
const verifyTripOwnership = async (
  tripId: number,
  userId: number
): Promise<void> => {
  const trip = await getTripById(tripId, userId);
  if (!trip) {
    throw new Error("Trip not found or access denied");
  }
};

// Helper: Verify user owns activity (via trip ownership)
const verifyActivityOwnership = async (
  activityId: number,
  userId: number
): Promise<void> => {
  const activity = await getActivityById(activityId);
  
  if (!activity) {
    throw new Error("Activity not found");
  }

  // Check if user owns the trip this activity belongs to
  const trip = await getTripById(activity.trip_id, userId);
  if (!trip) {
    throw new Error("Access denied: you don't own this activity");
  }
};

// Create activity
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const activityData: CreateActivityDto = req.body;

    // Validation
    if (!activityData.trip_id) {
      return res.status(400).json({ error: "Trip ID is required" });
    }

    if (!activityData.title || activityData.title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (activityData.title.length > 200) {
      return res.status(400).json({ error: "Title too long (max 200 characters)" });
    }

    if (!activityData.day_number || activityData.day_number < 1) {
      return res.status(400).json({ error: "Valid day number is required" });
    }

    // Validate trip ownership
    try {
      await verifyTripOwnership(activityData.trip_id, req.userId!);
    } catch (error: any) {
      return res.status(403).json({ error: error.message });
    }

    // Validate optional fields
    if (activityData.cost && (activityData.cost < 0 || activityData.cost > 999999)) {
      return res.status(400).json({ error: "Invalid cost value" });
    }

    if (activityData.description && activityData.description.length > 1000) {
      return res.status(400).json({ error: "Description too long (max 1000 characters)" });
    }

    if (activityData.notes && activityData.notes.length > 1000) {
      return res.status(400).json({ error: "Notes too long (max 1000 characters)" });
    }

    // Create activity
    const activity = await createActivity(activityData);
    res.status(201).json(activity);
  } catch (error: any) {
    console.error("Create activity error:", error);
    
    if (error.message?.includes("foreign key constraint")) {
      return res.status(400).json({ error: "Invalid trip ID" });
    }

    res.status(500).json({ error: "Failed to create activity" });
  }
});

// Get activities for specific day
router.get("/trip/:tripId/day/:dayNumber", async (req: AuthRequest, res: Response) => {
  try {
    // Validate IDs
    let tripId: number;
    let dayNumber: number;

    try {
      tripId = validateId(req.params.tripId, "trip ID");
      dayNumber = validateId(req.params.dayNumber, "day number");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }

    // Verify ownership
    try {
      await verifyTripOwnership(tripId, req.userId!);
    } catch (error: any) {
      return res.status(403).json({ error: error.message });
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
    // Validate ID
    let activityId: number;
    try {
      activityId = validateId(req.params.id, "activity ID");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }

    // Verify ownership
    try {
      await verifyActivityOwnership(activityId, req.userId!);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 403;
      return res.status(status).json({ error: error.message });
    }

    // Toggle completion
    const activity = await toggleActivityComplete(activityId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Toggle activity error:", error);
    res.status(500).json({ error: "Failed to toggle activity status" });
  }
});

// Update activity
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    // Validate ID
    let activityId: number;
    try {
      activityId = validateId(req.params.id, "activity ID");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }

    // Verify ownership
    try {
      await verifyActivityOwnership(activityId, req.userId!);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 403;
      return res.status(status).json({ error: error.message });
    }

    const updates: UpdateActivityDto = req.body;

    // Validate updates
    if (updates.title !== undefined) {
      if (typeof updates.title !== "string" || updates.title.trim().length === 0) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      if (updates.title.length > 200) {
        return res.status(400).json({ error: "Title too long (max 200 characters)" });
      }
    }

    if (updates.day_number !== undefined && updates.day_number < 1) {
      return res.status(400).json({ error: "Day number must be at least 1" });
    }

    if (updates.cost !== undefined && (updates.cost < 0 || updates.cost > 999999)) {
      return res.status(400).json({ error: "Invalid cost value" });
    }

    if (updates.description && updates.description.length > 1000) {
      return res.status(400).json({ error: "Description too long" });
    }

    if (updates.notes && updates.notes.length > 1000) {
      return res.status(400).json({ error: "Notes too long" });
    }

    // Update activity
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
    // Validate ID
    let activityId: number;
    try {
      activityId = validateId(req.params.id, "activity ID");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }

    // Verify ownership
    try {
      await verifyActivityOwnership(activityId, req.userId!);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 403;
      return res.status(status).json({ error: error.message });
    }

    // Delete activity
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