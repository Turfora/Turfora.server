const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[Auth Middleware] Authorization header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is missing',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    console.log('[Auth Middleware] Token:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth Middleware] Token verified for user:', decoded.id);
    console.log('[Auth Middleware] User details:', decoded);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    console.log('[Auth Middleware] req.user set:', req.user);

    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;