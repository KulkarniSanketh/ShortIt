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

const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port,
  mongoUrl: required("MONGO_URL"),
  baseUrl: (process.env.BASE_URL || `http://localhost:${port}`).replace(/\/$/, ""),
  frontendOrigins: (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

module.exports = env;
