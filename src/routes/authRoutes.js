const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');
const { registerRules, loginRules, validate } = require('../validators/user.validator');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// POST /api/auth/register
router.post('/register', authLimiter, registerRules, validate, authController.register);

// POST /api/auth/login
router.post('/login', authLimiter, loginRules, validate, authController.login);

// GET /api/auth/profile (protected)
router.get('/profile', profileLimiter, authMiddleware, authController.getProfile);

module.exports = router;