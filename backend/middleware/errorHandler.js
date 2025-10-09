// 404 Error Handler Middleware
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// API 404 Error Handler
export const apiNotFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found 🔍",
    error: {
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
    suggestion: "Please check the API documentation for valid endpoints.",
    availableRoutes: [
      "/api/auth - Authentication routes",
      "/api/user - User management routes",
      "/api/shop - Shop management routes",
      "/api/item - Item/Food management routes",
      "/api/order - Order management routes",
    ],
  });
};

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Error:", {
    message: err.message,
    status: statusCode,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    error: {
      status: statusCode,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// Async Error Handler Wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
