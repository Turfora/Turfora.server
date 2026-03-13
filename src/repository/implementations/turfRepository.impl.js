const supabase = require('../../config/db.config');

const TABLE = 'turfs';

const getTurfs = async (filters = {}) => {
  try {
    console.log('[turfRepository] getTurfs START');
    console.log('[turfRepository] Table:', TABLE);
    console.log('[turfRepository] Filters:', JSON.stringify(filters));

    // Start building the query
    let query = supabase.from(TABLE).select('*');

    // Apply category filter if provided
    if (filters.category && filters.category !== 'All') {
      console.log('[turfRepository] Filtering by category:', filters.category);
      query = query.eq('category', filters.category);
    }

    // Apply is_featured filter ONLY if explicitly set
    if (filters.is_featured === true) {
      console.log('[turfRepository] Filtering by is_featured: true');
      query = query.eq('is_featured', true);
    }

    // Execute the query
    console.log('[turfRepository] Executing query...');
    const { data, error } = await query;

    // Handle errors
    if (error) {
      console.error('[turfRepository] Supabase query failed');
      console.error('[turfRepository] Error code:', error.code);
      console.error('[turfRepository] Error message:', error.message);
      console.error('[turfRepository] Full error:', JSON.stringify(error, null, 2));
      throw new Error(`Database query failed: ${error.message} (Code: ${error.code})`);
    }

    console.log('[turfRepository] Query successful');
    console.log('[turfRepository] Retrieved', data?.length || 0, 'turfs');

    // Return data or empty array
    return data || [];
  } catch (error) {
    console.error('[turfRepository] getTurfs FAILED');
    console.error('[turfRepository] Error message:', error.message);
    console.error('[turfRepository] Error stack:', error.stack);
    throw error;
  }
};

const getTurfById = async (id) => {
  try {
    console.log('[turfRepository] getTurfById START with id:', id);

    if (!id) {
      throw new Error('ID is required');
    }

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[turfRepository] Supabase error:', error.message);
      throw new Error(`Database query failed: ${error.message}`);
    }

    console.log('[turfRepository] getTurfById SUCCESS');
    return data || null;
  } catch (error) {
    console.error('[turfRepository] getTurfById FAILED:', error.message);
    throw error;
  }
};

const createTurf = async (data) => {
  try {
    console.log('[turfRepository] createTurf START');
    console.log('[turfRepository] Data:', JSON.stringify(data, null, 2));

    if (!data.name || !data.category || !data.location || !data.price_per_hour) {
      throw new Error('Missing required fields: name, category, location, price_per_hour');
    }

    const { data: turf, error } = await supabase
      .from(TABLE)
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('[turfRepository] Supabase insert error:', error.message);
      throw new Error(`Failed to create turf: ${error.message}`);
    }

    console.log('[turfRepository] createTurf SUCCESS');
    return turf;
  } catch (error) {
    console.error('[turfRepository] createTurf FAILED:', error.message);
    throw error;
  }
};

module.exports = { getTurfs, getTurfById, createTurf };