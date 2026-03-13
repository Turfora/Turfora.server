<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const { AppError, handleError } = require('../utils/errorHandler');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token is required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return handleError(new AppError('Invalid token', 401), res);
    }
    if (err.name === 'TokenExpiredError') {
      return handleError(new AppError('Token has expired', 401), res);
    }
    return handleError(err, res);
  }
};
=======
const { verifyToken } = require('../utils/tokenGenerator');

/**
 * JWT authentication middleware.
 * Attaches the decoded payload to req.user on success.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
>>>>>>> deb2861ccc8a451638f9dea248c1f565f4dc3d32
