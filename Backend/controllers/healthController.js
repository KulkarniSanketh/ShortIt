const mongoose = require("mongoose");

function getHealth(req, res) {
  const dbState = mongoose.connection.readyState;
  const healthy = dbState === 1;

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? "ok" : "degraded",
    uptime: process.uptime(),
    database: healthy ? "connected" : "disconnected",
  });
}

module.exports = {
  getHealth,
};
