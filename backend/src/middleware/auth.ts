import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../db/queries";

// Use Express.Request directly - types are extended globally
export type AuthRequest = Request;

interface JWTPayload {
  userId: number;
  email: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ 
        error: "Access denied. No token provided." 
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "your-secret-key"
    ) as JWTPayload;

    // Check if user still exists
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ 
        error: "Invalid token. User not found." 
      });
      return;
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: "Token expired. Please login again." 
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: "Invalid token." 
      });
      return;
    }
    res.status(500).json({ 
      error: "Authentication failed." 
    });
  }
};

// Middleware för att kontrollera token utan att kräva den
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || "your-secret-key"
      ) as JWTPayload;
      
      const user = await findUserById(decoded.userId);
      if (user) {
        req.userId = decoded.userId;
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    }
    
    next();
  } catch (error) {
    // Ignorera fel, gå vidare utan user
    next();
  }
};