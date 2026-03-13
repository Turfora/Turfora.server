const { body, validationResult } = require('express-validator');

/**
 * Validation rules for registration.
 */
const registerRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('A valid phone number is required'),
];

/**
 * Validation rules for login.
 */
const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Middleware that returns 422 if any validation rule failed.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = { registerRules, loginRules, validate };
