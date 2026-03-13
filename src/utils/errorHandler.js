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
