const supabase = require('../../config/db.config');

const TABLE = 'users';

const createUser = async (data) => {
  try {
    console.log('[userRepository] Creating user with data:', data);
    
    const { data: user, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('[userRepository] Supabase createUser error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('[userRepository] User created successfully:', { id: user.id, email: user.email });
    return user;
  } catch (error) {
    console.error('[userRepository] createUser error:', error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    console.log('[userRepository] Finding user by email:', email);
    
    const { data: user, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[userRepository] Supabase findUserByEmail error:', {
        code: error.code,
        message: error.message
      });
      throw error;
    }
    
    if (!user) {
      console.log('[userRepository] No user found with email:', email);
    } else {
      console.log('[userRepository] User found:', { id: user.id, email: user.email });
    }
    
    return user || null;
  } catch (error) {
    console.error('[userRepository] findUserByEmail error:', error);
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    console.log('[userRepository] Finding user by id:', id);
    
    const { data: user, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[userRepository] Supabase findUserById error:', error);
      throw error;
    }
    
    return user || null;
  } catch (error) {
    console.error('[userRepository] findUserById error:', error);
    throw error;
  }
};

const updateUser = async (id, data) => {
  try {
    console.log('[userRepository] Updating user:', { id, data });
    
    const { data: user, error } = await supabase
      .from(TABLE)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[userRepository] Supabase updateUser error:', error);
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('[userRepository] updateUser error:', error);
    throw error;
  }
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser };