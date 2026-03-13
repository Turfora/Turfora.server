<<<<<<< HEAD
const { supabase } = require('../../config/db.config');
const UserModel = require('../../models/User.model');

module.exports = {
  async createUser(data) {
    const { data: user, error } = await supabase
      .from(UserModel.tableName)
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return user;
  },

  async findUserByEmail(email) {
    const { data: user, error } = await supabase
      .from(UserModel.tableName)
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return user || null;
  },

  async findUserById(id) {
    const { data: user, error } = await supabase
      .from(UserModel.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return user || null;
  },

  async updateUser(id, data) {
    const { data: user, error } = await supabase
      .from(UserModel.tableName)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return user;
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from(UserModel.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};
=======
const supabase = require('../../config/db.config');

const TABLE = 'users';

/**
 * Insert a new user row. `data` must use camelCase keys matching the DB columns.
 */
const createUser = async (data) => {
  const { data: user, error } = await supabase
    .from(TABLE)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return user;
};

/**
 * Find a user by email address.
 */
const findUserByEmail = async (email) => {
  const { data: user, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', email)
    .is('deletedAt', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return user || null;
};

/**
 * Find a user by primary key (UUID).
 */
const findUserById = async (id) => {
  const { data: user, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .is('deletedAt', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return user || null;
};

/**
 * Patch a user row by id.
 */
const updateUser = async (id, data) => {
  const { data: user, error } = await supabase
    .from(TABLE)
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return user;
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser };
>>>>>>> deb2861ccc8a451638f9dea248c1f565f4dc3d32
