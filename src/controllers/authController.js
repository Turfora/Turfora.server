const authService = require('../services/implementations/authService.impl');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const result = await authService.register(fullName, email, password, phone);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/profile  (protected)
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile };
