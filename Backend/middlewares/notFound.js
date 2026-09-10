function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} was not found`,
  });
}

module.exports = notFound;
