const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const env = require("./config/env");
const requestLogger = require("./middlewares/requestLogger");
const apiRouter = require("./routes/api");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const asyncHandler = require("./middlewares/asyncHandler");
const { redirectToOriginal } = require("./controllers/urlController");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: env.frontendOrigins,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    name: "ShortIt API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

app.use("/api", apiRouter);
app.get("/:shortId", asyncHandler(redirectToOriginal));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
