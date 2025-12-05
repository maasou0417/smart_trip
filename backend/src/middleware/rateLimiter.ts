import rateLimit from "express-rate-limit";

// Auth rate limiter - login/register
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minuter
  max: 10, // Max 10 requests per 5 min
  message: {
    error: "Too many login attempts. Please try again in 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minuter
  max: 100, // Max 100 requests per 5 min
  message: {
    error: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});