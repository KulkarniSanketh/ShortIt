const express = require("express");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("../middlewares/asyncHandler");
const { createShortUrl, getAnalytics, listRecentUrls } = require("../controllers/urlController");
const { createContact } = require("../controllers/contactController");
const { getHealth } = require("../controllers/healthController");

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again shortly." },
});

router.get("/health", getHealth);
router.get("/urls", asyncHandler(listRecentUrls));
router.post("/urls", writeLimiter, asyncHandler(createShortUrl));
router.get("/urls/:shortId/analytics", asyncHandler(getAnalytics));
router.post("/contact", writeLimiter, asyncHandler(createContact));

module.exports = router;
