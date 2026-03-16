const bcrypt = require('bcryptjs');
const userRepo = require('../../repository/implementations/userRepository.impl');
const User = require('../../models/User.model');
const { generateToken } = require('../../utils/tokenGenerator');

const SALT_ROUNDS = 10;

const register = async (fullName, email, password, phone, role = 'USER') => {
  try {
    const safeRole = ['USER', 'OWNER'].includes(role) ? role : 'USER';
    console.log('[authService] Register request:', { fullName, email, phone, role: safeRole });
    
    const existing = await userRepo.findUserByEmail(email);
    if (existing) {
      console.log('[authService] User already exists:', email);
      const err = new Error('Email is already registered');
      err.statusCode = 409;
      throw err;
    }

    console.log('[authService] Hashing password...');
    const passwordhash = await bcrypt.hash(password, SALT_ROUNDS);

    console.log('[authService] Creating user in DB...');
    const raw = await userRepo.createUser({
      email,
      passwordhash,
      fullname: fullName,
      phone: phone || null,
      role: safeRole,
    });

    console.log('[authService] User created successfully:', { id: raw.id, email: raw.email });
    
    const user = new User(raw);
    const token = generateToken({ id: user.id, email: user.email });

    return { user: user.toPublic(), token };
  } catch (error) {
    console.error('[authService] Register error:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      fullError: error
    });
    throw error;
  }
};

const login = async (email, password) => {
  try {
    console.log('[authService] Login request:', { email });
    
    const raw = await userRepo.findUserByEmail(email);
    if (!raw) {
      console.log('[authService] User not found:', email);
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    console.log('[authService] Comparing password...');
    const isMatch = await bcrypt.compare(password, raw.passwordhash);
    if (!isMatch) {
      console.log('[authService] Password mismatch for user:', email);
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    console.log('[authService] Login successful for user:', email);
    const user = new User(raw);
    const token = generateToken({ id: user.id, email: user.email });

    const publicUser = user.toPublic();
    return { user: publicUser, token, role: publicUser.role };
  } catch (error) {
    console.error('[authService] Login error:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    });
    throw error;
  }
};

const getProfile = async (userId) => {
  try {
    console.log('[authService] Getting profile for user:', userId);
    
    const raw = await userRepo.findUserById(userId);
    if (!raw) {
      console.log('[authService] Profile not found for user:', userId);
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    
    return new User(raw).toPublic();
  } catch (error) {
    console.error('[authService] getProfile error:', {
      message: error.message,
      statusCode: error.statusCode
    });
    throw error;
  }
};

module.exports = { register, login, getProfile };