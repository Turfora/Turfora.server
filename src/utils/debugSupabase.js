require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const testBothKeys = async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_KEY;

  console.log('='.repeat(60));
  console.log('SUPABASE CONNECTION DEBUG');
  console.log('='.repeat(60));

  // Test with ANON KEY
  console.log('\n--- TEST 1: Using ANON KEY ---');
  if (anonKey) {
    const anonClient = createClient(supabaseUrl, anonKey);
    try {
      const { data, error, count } = await anonClient
        .from('turfs')
        .select('*', { count: 'exact' });

      if (error) {
        console.error('❌ ANON KEY ERROR:', error);
      } else {
        console.log('✅ ANON KEY SUCCESS');
        console.log('   Total turfs:', count);
        console.log('   Data returned:', data?.length || 0);
        if (data?.length > 0) {
          console.log('   First turf:', JSON.stringify(data[0], null, 2));
        }
      }
    } catch (err) {
      console.error('❌ ANON KEY EXCEPTION:', err.message);
    }
  }

  // Test with SERVICE KEY
  console.log('\n--- TEST 2: Using SERVICE KEY ---');
  if (serviceKey) {
    const serviceClient = createClient(supabaseUrl, serviceKey);
    try {
      const { data, error, count } = await serviceClient
        .from('turfs')
        .select('*', { count: 'exact' });

      if (error) {
        console.error('❌ SERVICE KEY ERROR:', error);
      } else {
        console.log('✅ SERVICE KEY SUCCESS');
        console.log('   Total turfs:', count);
        console.log('   Data returned:', data?.length || 0);
        if (data?.length > 0) {
          console.log('   First turf:', JSON.stringify(data[0], null, 2));
        }
      }
    } catch (err) {
      console.error('❌ SERVICE KEY EXCEPTION:', err.message);
    }
  }

  // Test filter
  console.log('\n--- TEST 3: Filter by category (SERVICE KEY) ---');
  if (serviceKey) {
    const serviceClient = createClient(supabaseUrl, serviceKey);
    try {
      const { data, error } = await serviceClient
        .from('turfs')
        .select('*')
        .eq('category', 'Football');

      if (error) {
        console.error('❌ FILTER ERROR:', error);
      } else {
        console.log('✅ FILTER SUCCESS');
        console.log('   Football turfs:', data?.length || 0);
        if (data?.length > 0) {
          console.log('   First Football turf:', data[0].name);
        }
      }
    } catch (err) {
      console.error('❌ FILTER EXCEPTION:', err.message);
    }
  }

  console.log('\n' + '='.repeat(60));
};

testBothKeys().catch(console.error);