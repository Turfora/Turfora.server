const authService = require('../services/auth.service');

module.exports = {
  verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
};