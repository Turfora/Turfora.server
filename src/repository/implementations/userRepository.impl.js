const supabase = require('../../config/db.config');
module.exports = { createUser: async (data) => supabase.from('users').insert(data) };