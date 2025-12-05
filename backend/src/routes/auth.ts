import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../db/queries";
import { CreateUserDto, LoginDto } from "../types";
import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
} from "../utils/validation";
import { authLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Register - with rate limiting
router.post("/register", authLimiter, async (req: Request, res: Response) => {
  try {
    let { email, password, name }: CreateUserDto = req.body;

    // Sanitize inputs
    email = sanitizeInput(email).toLowerCase();
    name = sanitizeInput(name);

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate name
    const nameError = validateName(name);
    if (nameError) {
      return res.status(400).json({ error: nameError });
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error:
          "Email already registered. Please use a different email or login.",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Log successful registration
    console.log(`✅ New user registered: ${user.email}`);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Login - with rate limiting
router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    let { email, password }: LoginDto = req.body;

    // Sanitize email
    email = sanitizeInput(email).toLowerCase();

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Log successful login
    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Verify token endpoint
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      valid: true,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;