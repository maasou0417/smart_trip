import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Extra säkerhet

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "✅ Smart Trip API is running!" });
});

// Routes 
app.use("/api/auth", require("./routes/auth").default);
app.use("/api/trips", require("./routes/trips").default);
app.use("/api/activities", require("./routes/activities").default);

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});