require('dotenv').config();
const supabase = require('../config/db.config');

const testConnection = async () => {
  try {
    console.log('[testSupabase] Testing Supabase connection...');
    
    // Test 1: Simple select
    console.log('[testSupabase] Test 1: Simple SELECT all from turfs');
    const { data: allTurfs, error: allError } = await supabase
      .from('turfs')
      .select('*');
    
    if (allError) {
      console.error('[testSupabase] Error getting all turfs:', allError);
    } else {
      console.log('[testSupabase] SUCCESS - Got', allTurfs?.length || 0, 'turfs');
      if (allTurfs && allTurfs.length > 0) {
        console.log('[testSupabase] First turf:', JSON.stringify(allTurfs[0], null, 2));
      }
    }

    // Test 2: Count
    console.log('\n[testSupabase] Test 2: COUNT');
    const { count, error: countError } = await supabase
      .from('turfs')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('[testSupabase] Error counting:', countError);
    } else {
      console.log('[testSupabase] Total turfs in database:', count);
    }

    // Test 3: Filter by category
    console.log('\n[testSupabase] Test 3: Filter by category=Football');
    const { data: footballTurfs, error: footballError } = await supabase
      .from('turfs')
      .select('*')
      .eq('category', 'Football');
    
    if (footballError) {
      console.error('[testSupabase] Error getting Football turfs:', footballError);
    } else {
      console.log('[testSupabase] Got', footballTurfs?.length || 0, 'Football turfs');
      if (footballTurfs && footballTurfs.length > 0) {
        console.log('[testSupabase] First Football turf:', JSON.stringify(footballTurfs[0], null, 2));
      }
    }

    // Test 4: Check row data types
    console.log('\n[testSupabase] Test 4: Check data types');
    const { data: sampleTurfs } = await supabase
      .from('turfs')
      .select('*')
      .limit(1);
    
    if (sampleTurfs && sampleTurfs.length > 0) {
      const turf = sampleTurfs[0];
      console.log('[testSupabase] Sample turf data:');
      for (const key in turf) {
        console.log(`  ${key}: ${typeof turf[key]} = ${JSON.stringify(turf[key])}`);
      }
    }

  } catch (error) {
    console.error('[testSupabase] Error:', error.message);
    console.error('[testSupabase] Stack:', error.stack);
  }
};

testConnection();