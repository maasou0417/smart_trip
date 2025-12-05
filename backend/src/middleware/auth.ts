import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../db/queries";

// Extend Express Request type
export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Access denied. No token provided." 
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    // Check if user still exists
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid token. User not found." 
      });
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
      return res.status(401).json({ 
        error: "Token expired. Please login again." 
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: "Invalid token." 
      });
    }
    return res.status(500).json({ 
      error: "Authentication failed." 
    });
  }
};

 // Middleware för att kontrollera token utan att kräva den
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      
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