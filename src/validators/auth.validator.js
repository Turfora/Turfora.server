const Joi = require('joi');

const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  full_name: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name cannot exceed 100 characters',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

module.exports = {
  validateSignUp(data) {
    return signUpSchema.validate(data, { abortEarly: true, stripUnknown: true });
  },
  validateLogin(data) {
    return loginSchema.validate(data, { abortEarly: true, stripUnknown: true });
  },
  validateResetPassword(data) {
    return resetPasswordSchema.validate(data, { abortEarly: true, stripUnknown: true });
  },
};
