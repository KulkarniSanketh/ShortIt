const express = require("express");
const rateLimit = require("express-rate-limit");

const asyncHandler = require("../middlewares/asyncHandler");

const {
  createShortUrl,
  getAnalytics,
  getAliasSuggestions,
} = require("../controllers/urlController");

const { createContact } = require("../controllers/contactController");
const { getHealth } = require("../controllers/healthController");

const router = express.Router();

// Rate limiter for write operations
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again shortly.",
  },
});

// Rate limiter for read/analytics operations
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again shortly.",
  },
});

// Health check
router.get("/health", getHealth);

// Create shortened URL
router.post(
  "/urls",
  writeLimiter,
  asyncHandler(createShortUrl)
);

// Alias suggestions for a taken custom alias
router.get(
  "/urls/suggestions",
  readLimiter,
  asyncHandler(getAliasSuggestions)
);

// Get URL analytics
router.get(
  "/urls/:shortId/analytics",
  readLimiter,
  asyncHandler(getAnalytics)
);

// Contact form
router.post(
  "/contact",
  writeLimiter,
  asyncHandler(createContact)
);

module.exports = router;

