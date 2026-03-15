const supabase = require('../../config/db.config');
const Turf = require('../../models/Turf.model');

const TABLE = 'turfs';

/**
 * Get all turfs with pagination and optional filters
 */
const getAllTurfs = async (category = null, limit = 50, offset = 0) => {
  console.log('[TurfRepository] Getting all turfs');

  try {
    let query = supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: turfs, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    console.log('[TurfRepository] Found', turfs?.length, 'turfs');

    return {
      turfs: turfs || [],
      count: count || 0,
    };
  } catch (error) {
    console.error('[TurfRepository] Error in getAllTurfs:', error.message);
    throw error;
  }
};

/**
 * Get turfs with filters
 */
const getTurfs = async (filters = {}) => {
  console.log('[TurfRepository] Getting turfs with filters:', filters);

  try {
    let query = supabase
      .from(TABLE)
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    const { data: turfs, error } = await query.limit(filters.limit || 50).offset(filters.offset || 0);

    if (error) throw error;

    console.log('[TurfRepository] Retrieved', turfs?.length, 'turfs');
    return turfs || [];
  } catch (error) {
    console.error('[TurfRepository] Error in getTurfs:', error.message);
    throw error;
  }
};

/**
 * Find turf by ID
 */
const getTurfById = async (id, ownerId = null) => {
  console.log('[TurfRepository] Finding turf:', id);

  try {
    let query = supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .is('deleted_at', null);

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data: turf, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    console.log('[TurfRepository] Found turf:', turf?.id);
    return turf || null;
  } catch (error) {
    console.error('[TurfRepository] Error in getTurfById:', error.message);
    throw error;
  }
};

/**
 * Find turfs by owner ID with pagination
 */
const findTurfsByOwnerId = async (ownerId, limit = 50, offset = 0) => {
  console.log('[TurfRepository] Finding turfs for owner:', ownerId);

  try {
    const { data: turfs, error, count } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .eq('owner_id', ownerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[TurfRepository] Error:', error);
      throw error;
    }

    console.log('[TurfRepository] Found turfs:', turfs?.length);

    return {
      turfs: turfs || [],
      count: count || 0,
    };
  } catch (error) {
    console.error('[TurfRepository] Error in findTurfsByOwnerId:', error.message);
    throw error;
  }
};

/**
 * Create a new turf
 */
const createTurf = async (data) => {
  console.log('[TurfRepository] Creating turf');
  console.log('[TurfRepository] Input data:', data);

  const now = new Date().toISOString();

  const insertData = {
    owner_id: data.ownerId,
    name: data.name,
    description: data.description,
    location: data.location,
    category: data.category,
    price_per_hour: data.pricePerHour,
    opening_time: data.openingTime || '06:00',
    closing_time: data.closingTime || '22:00',
    phone_number: data.phoneNumber,
    amenities: data.amenities || [],
    images: data.images || [],
    image_url: data.images?.[0] || null,
    videos: data.videos || [],
    is_active: true,
    created_at: now,
    updated_at: now,
  };

  console.log('[TurfRepository] Final insert data:', insertData);

  try {
    const { data: turf, error } = await supabase
      .from(TABLE)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[TurfRepository] Supabase error:', error);
      throw error;
    }

    console.log('[TurfRepository] Turf created:', turf);
    return turf;
  } catch (error) {
    console.error('[TurfRepository] Error in createTurf:', error.message);
    throw error;
  }
};

/**
 * Update turf
 */
const updateTurf = async (id, data, ownerId) => {
  console.log('[TurfRepository] Updating turf:', id);

  const updateData = {
    updated_at: new Date().toISOString(),
  };

  if (data.name) updateData.name = data.name;
  if (data.description) updateData.description = data.description;
  if (data.location) updateData.location = data.location;
  if (data.category) updateData.category = data.category;
  if (data.pricePerHour) updateData.price_per_hour = data.pricePerHour;
  if (data.phoneNumber) updateData.phone_number = data.phoneNumber;
  if (data.amenities) updateData.amenities = data.amenities;
  if (data.openingTime) updateData.opening_time = data.openingTime;
  if (data.closingTime) updateData.closing_time = data.closingTime;
  if (data.images) {
    updateData.images = data.images;
    updateData.image_url = data.images[0];
  }
  if (data.videos) updateData.videos = data.videos;

  console.log('[TurfRepository] Update data:', updateData);

  try {
    const { data: turf, error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single();

    if (error) {
      console.error('[TurfRepository] Supabase error:', error);
      throw error;
    }

    if (!turf) {
      const err = new Error('Turf not found or you are not the owner');
      err.statusCode = 404;
      throw err;
    }

    console.log('[TurfRepository] Turf updated:', turf.id);
    return turf;
  } catch (error) {
    console.error('[TurfRepository] Error in updateTurf:', error.message);
    throw error;
  }
};

/**
 * Soft delete turf
 */
const deleteTurf = async (id, ownerId) => {
  console.log('[TurfRepository] Deleting turf:', id);

  try {
    const { error } = await supabase
      .from(TABLE)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('owner_id', ownerId);

    if (error) throw error;

    console.log('[TurfRepository] Turf deleted:', id);
    return true;
  } catch (error) {
    console.error('[TurfRepository] Error in deleteTurf:', error.message);
    throw error;
  }
};

/**
 * Get turf statistics
 */
const getTurfStats = async (turfId, ownerId) => {
  console.log('[TurfRepository] Getting turf stats');

  try {
    const turf = await getTurfById(turfId, ownerId);
    if (!turf) {
      const err = new Error('Turf not found');
      err.statusCode = 404;
      throw err;
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('amount')
      .eq('turf_id', turfId)
      .in('status', ['completed', 'confirmed']);

    if (error) throw error;

    const revenue = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);

    return {
      turfId,
      turfName: turf.name,
      bookingsCount: bookings?.length || 0,
      totalRevenue: revenue,
      price: turf.price_per_hour,
    };
  } catch (error) {
    console.error('[TurfRepository] Error in getTurfStats:', error.message);
    throw error;
  }
};


module.exports = {
  getAllTurfs,
  getTurfs,
  getTurfById,
  findTurfsByOwnerId,
  createTurf,
  updateTurf,
  deleteTurf,
  getTurfStats,
};