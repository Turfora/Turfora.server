const turfRepo = require('../../repository/implementations/turfRepository.impl');
const Turf = require('../../models/Turf.model');

/**
 * Normalize time format from HH:MM to HH:MM:SS
 */
const normalizeTime = (time) => {
  if (!time) return null;
  if (time.match(/^\d{2}:\d{2}:\d{2}$/)) return time;
  if (time.match(/^\d{2}:\d{2}$/)) return time + ':00';
  return null;
};

/**
 * Get all turfs with pagination and filters
 */
const getAllTurfs = async (category = null, limit = 50, offset = 0) => {
  try {
    console.log('[turfService] Getting all turfs:', { category, limit, offset });

    const result = await turfRepo.getAllTurfs(category, limit, offset);

    console.log('[turfService] Retrieved', result.turfs.length, 'turfs from repo');

    return {
      turfs: result.turfs.map(t => new Turf(t).toPublic()),
      count: result.count,
    };
  } catch (error) {
    console.error('[turfService] getAllTurfs error:', error.message);
    throw error;
  }
};

/**
 * Get turfs with optional filters
 */
const getTurfs = async (filters = {}) => {
  try {
    console.log('[turfService] Fetching turfs with filters:', filters);

    const raw = await turfRepo.getTurfs(filters);

    console.log('[turfService] Retrieved turfs from repo:', raw.length);

    // If no turfs in database, return empty array
    if (!raw || raw.length === 0) {
      console.log('[turfService] No turfs found in database');
      return [];
    }

    // Map to Turf model instances
    const turfs = raw.map((t) => {
      try {
        return new Turf(t).toPublic();
      } catch (err) {
        console.error('[turfService] Error mapping turf:', err.message, 'turf data:', t);
        return null;
      }
    }).filter(t => t !== null);

    console.log('[turfService] Mapped', turfs.length, 'turfs');
    return turfs;
  } catch (error) {
    console.error('[turfService] getTurfs error:', error.message);
    console.error('[turfService] Error stack:', error.stack);
    throw error;
  }
};

/**
 * Get turf by ID
 */
const getTurfById = async (id) => {
  try {
    console.log('[turfService] Fetching turf by id:', id);

    const raw = await turfRepo.getTurfById(id);

    if (!raw) {
      console.log('[turfService] Turf not found:', id);
      return null;
    }

    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] getTurfById error:', error.message);
    throw error;
  }
};

/**
 * Create a new turf
 * IMPORTANT: ownerId MUST be provided from authenticated user
 */
const createTurf = async (data) => {
  try {
    console.log('[turfService] Creating turf with data:', data);

    // Validate required fields
    if (!data.name || !data.price_per_hour || !data.location) {
      const err = new Error('Missing required fields: name, price_per_hour, location');
      err.statusCode = 400;
      throw err;
    }

    // CRITICAL: owner_id must be provided
    if (!data.owner_id) {
      console.error('[turfService] owner_id is missing!');
      const err = new Error('Owner ID is required. User must be authenticated.');
      err.statusCode = 401;
      throw err;
    }

    console.log('[turfService] owner_id:', data.owner_id);
    console.log('[turfService] Turf name:', data.name);
    console.log('[turfService] Price:', data.price_per_hour);

    const now = new Date().toISOString();

    // Build complete turf data with DB field names
    const turfData = {
      owner_id: data.owner_id,
      name: data.name,
      description: data.description,
      location: data.location,
      category: data.category || 'Cricket',
      price_per_hour: parseFloat(data.price_per_hour),
      opening_time: normalizeTime(data.opening_time) || '06:00:00',
      closing_time: normalizeTime(data.closing_time) || '22:00:00',
      phone_number: data.phone_number,
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      image_url: data.image_url, // <-- Important for images!
      videos: Array.isArray(data.videos) ? data.videos : [],
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    console.log('[turfService] Final turf data for repo:', turfData);

    // Call repository to create (make sure it also uses these names)
    const raw = await turfRepo.createTurf(turfData);

    console.log('[turfService] Turf created successfully:', raw.id);
    console.log('[turfService] Turf owner_id in DB:', raw.owner_id);

    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] createTurf error:', error.message);
    console.error('[turfService] Error:', error);
    throw error;
  }
};
/**
 * Update an existing turf
 */
const updateTurf = async (id, data, ownerId) => {
  try {
    console.log('[turfService] Updating turf:', id);
    console.log('[turfService] Owner verifying:', ownerId);

    if (!id || !ownerId) {
      const err = new Error('Turf ID and Owner ID are required');
      err.statusCode = 400;
      throw err;
    }

    const raw = await turfRepo.updateTurf(id, data, ownerId);

    console.log('[turfService] Turf updated successfully:', id);
    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] updateTurf error:', error.message);
    throw error;
  }
};

/**
 * Delete a turf (soft delete)
 */
const deleteTurf = async (id, ownerId) => {
  try {
    console.log('[turfService] Deleting turf:', id);

    if (!id || !ownerId) {
      const err = new Error('Turf ID and Owner ID are required');
      err.statusCode = 400;
      throw err;
    }

    await turfRepo.deleteTurf(id, ownerId);

    console.log('[turfService] Turf deleted successfully:', id);
    return { success: true };
  } catch (error) {
    console.error('[turfService] deleteTurf error:', error.message);
    throw error;
  }
};

/**
 * Get popular turfs sorted by rating
 */
const getPopularTurfs = async (limit = 10) => {
  try {
    console.log('[turfService] Getting popular turfs, limit:', limit);

    const raw = await turfRepo.getPopularTurfs(limit);

    console.log('[turfService] Retrieved', raw.length, 'popular turfs');

    return raw.map(t => new Turf(t).toPublic());
  } catch (error) {
    console.error('[turfService] getPopularTurfs error:', error.message);
    throw error;
  }
};


const getTurfsByOwnerId = async (ownerId, limit = 50, offset = 0) => {
  try {
    console.log('[turfService] Getting turfs for owner:', ownerId);

    if (!ownerId) {
      const err = new Error('Owner ID is required');
      err.statusCode = 400;
      throw err;
    }

    const result = await turfRepo.findTurfsByOwnerId(ownerId, limit, offset);

    console.log('[turfService] Found', result.turfs.length, 'turfs for owner');

    return {
      turfs: result.turfs.map(t => new Turf(t).toPublic()),
      count: result.count,
    };
  } catch (error) {
    console.error('[turfService] getTurfsByOwnerId error:', error.message);
    throw error;
  }
};

module.exports = {
  getAllTurfs,  // ADD THIS LINE
  getTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
  getPopularTurfs,
  getTurfsByOwnerId,
};