const supabase = require('../../config/db.config');

const TABLE = 'turfs';

const getTurfs = async (filters = {}) => {
  try {
    console.log('[turfRepository] Getting turfs with filters:', filters);

    let query = supabase.from(TABLE).select('*');

    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.is_featured) {
      query = query.eq('is_featured', true);
    }

    const { data: turfs, error } = await query;

    if (error) {
      console.error('[turfRepository] Supabase getTurfs error:', error);
      throw error;
    }

    console.log('[turfRepository] Retrieved turfs:', turfs.length);
    return turfs || [];
  } catch (error) {
    console.error('[turfRepository] getTurfs error:', error);
    throw error;
  }
};

const getTurfById = async (id) => {
  try {
    console.log('[turfRepository] Getting turf:', id);

    const { data: turf, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[turfRepository] Supabase getTurfById error:', error);
      throw error;
    }

    if (!turf) {
      console.log('[turfRepository] Turf not found:', id);
    }

    return turf || null;
  } catch (error) {
    console.error('[turfRepository] getTurfById error:', error);
    throw error;
  }
};

const createTurf = async (data) => {
  try {
    console.log('[turfRepository] Creating turf:', data);

    const { data: turf, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('[turfRepository] Supabase createTurf error:', error);
      throw error;
    }

    console.log('[turfRepository] Turf created:', turf.id);
    return turf;
  } catch (error) {
    console.error('[turfRepository] createTurf error:', error);
    throw error;
  }
};

const updateTurf = async (id, data) => {
  try {
    console.log('[turfRepository] Updating turf:', id);

    const { data: turf, error } = await supabase
      .from(TABLE)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[turfRepository] Supabase updateTurf error:', error);
      throw error;
    }

    return turf;
  } catch (error) {
    console.error('[turfRepository] updateTurf error:', error);
    throw error;
  }
};

module.exports = { getTurfs, getTurfById, createTurf, updateTurf };