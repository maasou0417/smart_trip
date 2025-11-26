import express, { Response } from "express";
import {
  createTrip,
  getTripsByUserId,
  getTripById,
  getTripWithActivities,
  updateTrip,
  deleteTrip,
} from "../db/queries";
import { verifyToken, AuthRequest } from "../middleware/auth";
import { CreateTripDto, UpdateTripDto } from "../types";

const router = express.Router();

// All trip routes require authentication
router.use(verifyToken);

// Get all trips for logged-in user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const trips = await getTripsByUserId(req.userId!);
    res.json(trips);
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// Get single trip with activities
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const trip = await getTripWithActivities(tripId, req.userId!);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

// Create new trip
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const tripData: CreateTripDto = req.body;

    // Validation
    if (
      !tripData.title ||
      !tripData.destination ||
      !tripData.start_date ||
      !tripData.end_date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const trip = await createTrip(req.userId!, tripData);
    res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// Update trip
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const updates: UpdateTripDto = req.body;

    const trip = await updateTrip(tripId, req.userId!, updates);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({ error: "Failed to update trip" });
  }
});

// Delete trip
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const deleted = await deleteTrip(tripId, req.userId!);

    if (!deleted) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

export default router;