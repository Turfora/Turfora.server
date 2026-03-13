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
