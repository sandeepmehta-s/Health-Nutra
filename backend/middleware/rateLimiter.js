import rateLimit from "express-rate-limit";

const isTestEnv = () => process.env.NODE_ENV === "test";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 login attempts per 15-minute window
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
  message: {
    success: false,
    message: "Too many login attempts. For security reasons, please try again in a few minutes.",
  },
});

export const orderRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // 60 order submissions per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
  message: {
    success: false,
    message: "Too many orders placed from this address. Please wait a few moments before trying again.",
  },
});

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 inquiries per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
  message: {
    success: false,
    message: "Too many contact inquiries received. Please wait a few minutes before submitting again.",
  },
});

export const trackingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // 120 tracking lookups per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
  message: {
    success: false,
    message: "Too many tracking lookups from this address. Please wait a few moments before trying again.",
  },
});
