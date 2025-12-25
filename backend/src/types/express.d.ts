import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: {
        id: number;
        email: string;
        name?: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
  };
}