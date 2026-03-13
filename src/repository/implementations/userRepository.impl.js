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
