const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repository/implementations/userRepository.impl');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

module.exports = {
  async register(email, password, fullname, phone) {
    // Check if user already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordhash = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.createUser({
      email,
      passwordhash,
      fullname,
      phone,
      role: 'user',
    });

    return user;
  },

  async login(email, password) {
    // Find user by email
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordhash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { user, token };
  },

  async getUserById(id) {
    return await userRepository.findUserById(id);
  },

  async updateUser(id, data) {
    return await userRepository.updateUser(id, data);
  },

  async deleteUser(id) {
    return await userRepository.deleteUser(id);
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};