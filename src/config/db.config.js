const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
