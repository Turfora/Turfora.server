const errorHandler = (err, req, res, next) => {
  console.error('[errorHandler] Handling error');
  console.error('[errorHandler] Message:', err.message);
  console.error('[errorHandler] Status:', err.statusCode || 500);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.APP_ENV === 'development' && {
      stack: err.stack,
      fullError: err,
    }),
  });
};

module.exports = errorHandler;