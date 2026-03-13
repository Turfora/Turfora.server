const bcrypt = require('bcryptjs');
const userRepo = require('../../repository/implementations/userRepository.impl');
const User = require('../../models/User.model');
const { generateToken } = require('../../utils/tokenGenerator');

const SALT_ROUNDS = 10;

/**
 * Register a new user.
 * @param {string} fullName
 * @param {string} email
 * @param {string} password  - plain-text password
 * @param {string} [phone]
 * @returns {{ user: object, token: string }}
 */
const register = async (fullName, email, password, phone) => {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) {
    const err = new Error('Email is already registered');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const now = new Date().toISOString();
  const raw = await userRepo.createUser({
    email,
    passwordHash,
    fullName,
    phone: phone || null,
    isEmailVerified: false,
    createdAt: now,
    updatedAt: now,
  });

  const user = new User(raw);
  const token = generateToken({ id: user.id, email: user.email });

  return { user: user.toPublic(), token };
};

/**
 * Login an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object, token: string }}
 */
const login = async (email, password) => {
  const raw = await userRepo.findUserByEmail(email);
  if (!raw) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, raw.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const user = new User(raw);
  const token = generateToken({ id: user.id, email: user.email });

  return { user: user.toPublic(), token };
};

/**
 * Get a user's profile by id.
 * @param {string} userId
 * @returns {object}
 */
const getProfile = async (userId) => {
  const raw = await userRepo.findUserById(userId);
  if (!raw) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return new User(raw).toPublic();
};

module.exports = { register, login, getProfile };
