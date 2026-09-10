/**
 * Loads and validates environment variables used by the API.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function required(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(value).trim();
}

const nodeEnv = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT) || 8000;
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "https://shortit-url.netlify.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port,
  mongoUrl: required("MONGO_URL"),
  baseUrl: (process.env.BASE_URL || "https://shortit-lluo.onrender.com").replace(/\/$/, ""),
  frontendOrigins: [...new Set([...configuredOrigins, "https://shortit-url.netlify.app"])],
};

module.exports = env;
