const morgan = require("morgan");

const format = process.env.NODE_ENV === "production" ? "combined" : "dev";
const logger = morgan(format);

/**
 * Writes HTTP access logs to stdout so containers and hosts can collect them.
 */
function requestLogger(req, res, next) {
  logger(req, res, next);
}

module.exports = requestLogger;
