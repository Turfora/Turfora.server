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
