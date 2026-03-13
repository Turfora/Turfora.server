<<<<<<< HEAD
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function handleError(err, res) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = { AppError, handleError };
=======
/**
 * Centralised error handler for Express.
 * Must be registered as the last middleware: app.use(errorHandler)
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.statusCode || err.status || 500;

  // Supabase PostgREST errors carry a `message` field directly
  const message = err.message || 'Internal server error';

  if (process.env.APP_ENV !== 'production') {
    console.error('[ErrorHandler]', err);
  }

  return res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
>>>>>>> deb2861ccc8a451638f9dea248c1f565f4dc3d32
