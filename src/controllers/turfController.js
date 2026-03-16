const turfService = require('../services/implementations/turfService.impl');

/**
 * POST /api/turfs
 * Create new turf (owner only)
 */
const createTurf = async (req, res, next) => {
  try {
    console.log('[TurfController] Creating turf');
    console.log('[TurfController] User ID from middleware:', req.user?.id);
    console.log('[TurfController] Request body:', req.body);

    const ownerId = req.user?.id;

    if (!ownerId) {
      console.error('[TurfController] Owner ID is missing');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated or ID missing',
      });
    }

    const data = req.body;

    // ==== FIX: Enforce correct field names ====
    if (!data.name || !data.price_per_hour || !data.location) {
      const err = new Error('Missing required fields: name, price_per_hour, location');
      err.statusCode = 400;
      throw err;
    }

    // Build data EXACTLY as your DB expects
    const turfData = {
      name: data.name,
      price_per_hour: data.price_per_hour, // DB field name
      location: data.location,
      owner_id: ownerId,                   // DB field name
      image_url: data.image_url,           // If owner sent an image
      // any other fields: amenities, rating, etc. as needed
    };

    console.log('[TurfController] Creating turf with:', turfData);

    // Now use the correct data object to create in service
    const turf = await turfService.createTurf(turfData);

    return res.status(201).json({
      success: true,
      message: 'Turf created successfully',
      data: turf,
    });
  } catch (err) {
    console.error('[TurfController] Error in createTurf:', err);
    next(err);
  }
};
/**
 * GET /api/turfs
 * Get all turfs (public)
 */
const getTurfs = async (req, res, next) => {
  try {
    console.log('[TurfController] Getting all turfs');
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;

    const result = await turfService.getAllTurfs(category, limit, offset);

    return res.status(200).json({
      success: true,
      data: result.turfs,
      pagination: { total: result.count, limit, offset },
    });
  } catch (err) {
    console.error('[TurfController] Error in getTurfs:', err);
    next(err);
  }
};


/**
 * GET /api/turfs/:id
 * Get single turf by ID
 */
const getTurfById = async (req, res, next) => {
  try {
    console.log('[TurfController] Getting turf by ID:', req.params.id);
    const turf = await turfService.getTurfById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: turf,
    });
  } catch (err) {
    console.error('[TurfController] Error in getTurfById:', err);
    next(err);
  }
};

/**
 * GET /api/turfs/popular
 * Get popular turfs sorted by rating (public)
 */
const getPopularTurfs = async (req, res, next) => {
  try {
    console.log('[TurfController] Getting popular turfs');
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const turfs = await turfService.getPopularTurfs(limit);

    return res.status(200).json({
      success: true,
      data: turfs,
    });
  } catch (err) {
    console.error('[TurfController] Error in getPopularTurfs:', err);
    next(err);
  }
};

module.exports = {
  createTurf,
  getTurfs,
  getTurfById,
  getPopularTurfs,
};