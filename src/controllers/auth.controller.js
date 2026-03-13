const authService = require('../services/auth.service');
const { AppError, handleError } = require('../utils/errorHandler');
const { validateSignUp, validateLogin, validateResetPassword } = require('../validators/auth.validator');

module.exports = {
  async signUp(req, res) {
    try {
      const { error, value } = validateSignUp(req.body);
      if (error) throw new AppError(error.details[0].message, 422);

      const result = await authService.signUp(value);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully. Please verify your email.',
        data: result,
      });
    } catch (err) {
      return handleError(err, res);
    }
  },

  async login(req, res) {
    try {
      const { error, value } = validateLogin(req.body);
      if (error) throw new AppError(error.details[0].message, 422);

      const result = await authService.login(value);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (err) {
      return handleError(err, res);
    }
  },

  async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

      await authService.logout(token);
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (err) {
      return handleError(err, res);
    }
  },

  async resetPassword(req, res) {
    try {
      const { error, value } = validateResetPassword(req.body);
      if (error) throw new AppError(error.details[0].message, 422);

      await authService.resetPassword(value.email);
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a password reset link has been sent.',
      });
    } catch (err) {
      return handleError(err, res);
    }
  },

  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      return handleError(err, res);
    }
  },
};
