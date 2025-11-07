const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Development vs production error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.status || 500).json({
      error: {
        message: err.message,
        stack: err.stack,
        ...err
      }
    });
  }

  // Production error response
  res.status(err.status || 500).json({
    error: {
      message: err.status < 500 ? err.message : 'Internal Server Error'
    }
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler
};