const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Use SERVICE KEY for backend (has full access)
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY;

console.log('[db.config] Initializing Supabase');
console.log('[db.config] URL exists:', !!supabaseUrl);
console.log('[db.config] Key exists:', !!supabaseKey);
console.log('[db.config] Using key type:', supabaseKey?.includes('sb_') ? 'SERVICE_KEY' : 'ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('[db.config] MISSING CREDENTIALS!');
  console.error('[db.config] SUPABASE_URL:', supabaseUrl);
  console.error('[db.config] SUPABASE_KEY:', supabaseKey);
  throw new Error('Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_KEY are set in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('[db.config] Supabase client created successfully');

module.exports = supabase;