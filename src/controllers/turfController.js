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

    // Validate required fields
    if (!data.name || !data.pricePerHour || !data.location) {
      const err = new Error('Missing required fields: name, pricePerHour, location');
      err.statusCode = 400;
      throw err;
    }

    // Add ownerId to data
    data.ownerId = ownerId;

    console.log('[TurfController] Creating turf with ownerId:', ownerId);

    const turf = await turfService.createTurf(data);

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

module.exports = {
  createTurf,
  getTurfs,
  getTurfById,
};