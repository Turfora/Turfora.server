const { supabase } = require('../../config/db.config');
const UserModel = require('../../models/User.model');

module.exports = {
  async createUser(data) {
    const { data: user, error } = await supabase
      .from('users')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return user;
  },

  async findUserByEmail(email) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return user || null;
  },

  async findUserById(id) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return user || null;
  },

  async updateUser(id, data) {
    const { data: user, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return user;
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};