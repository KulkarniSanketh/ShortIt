function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === "production";
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 409;
    message = "That custom alias is already in use";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON body";
  }

  if (!isProduction) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 && isProduction ? "Internal server error" : message,
  });
}

module.exports = errorHandler;
