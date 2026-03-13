const bcrypt = require('bcryptjs');
const { supabase } = require('../config/db.config');
const userRepo = require('../repository/implementations/userRepository.impl');
const UserModel = require('../models/User.model');
const tokenGenerator = require('../utils/tokenGenerator');
const { AppError } = require('../utils/errorHandler');

const SALT_ROUNDS = 12;

module.exports = {
  async signUp({ email, password, full_name }) {
    const existing = await userRepo.findUserByEmail(email);
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    if (authError) throw new AppError(authError.message, 400);

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.createUser({
      id: authData.user.id,
      email,
      password_hash,
      full_name: full_name || null,
      is_email_verified: false,
    });

    const token = tokenGenerator.generateToken({ id: user.id, email: user.email });
    return { user: UserModel.toSafeUser(user), token };
  },

  async login({ email, password }) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) throw new AppError('Invalid email or password', 401);

    const user = await userRepo.findUserById(authData.user.id);
    if (!user) throw new AppError('User not found', 404);

    const token = tokenGenerator.generateToken({ id: user.id, email: user.email });
    return { user: UserModel.toSafeUser(user), token };
  },

  async logout(accessToken) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AppError(error.message, 400);
    return true;
  },

  async resetPassword(email) {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return true;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL || `${process.env.CORS_ORIGIN}/reset-password`,
    });
    if (error) throw new AppError(error.message, 400);
    return true;
  },

  async updatePassword(userId, newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new AppError(error.message, 400);

    const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userRepo.updateUser(userId, { password_hash });
    return true;
  },

  async getProfile(userId) {
    const user = await userRepo.findUserById(userId);
    if (!user) throw new AppError('User not found', 404);
    return UserModel.toSafeUser(user);
  },
};
