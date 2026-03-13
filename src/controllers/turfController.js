const turfService = require('../services/implementations/turfService.impl');

const getTurfs = async (req, res, next) => {
  try {
    console.log('[turfController] getTurfs endpoint hit');
    console.log('[turfController] Query params:', req.query);

    // ONLY add is_featured if explicitly requested
    const filters = {};
    
    if (req.query.category) {
      filters.category = req.query.category;
      console.log('[turfController] Adding category filter:', filters.category);
    }
    
    if (req.query.featured === 'true') {
      filters.is_featured = true;
      console.log('[turfController] Adding is_featured filter: true');
    }

    console.log('[turfController] Final filters:', JSON.stringify(filters));
    const turfs = await turfService.getTurfs(filters);

    console.log('[turfController] Service returned', turfs.length, 'turfs');

    return res.status(200).json({
      success: true,
      data: turfs,
      count: turfs.length,
    });
  } catch (err) {
    console.error('[turfController] getTurfs error:', err.message);
    console.error('[turfController] Error stack:', err.stack);
    return next(err);
  }
};

const getTurfById = async (req, res, next) => {
  try {
    console.log('[turfController] getTurfById endpoint hit, id:', req.params.id);

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
    console.error('[turfController] getTurfById error:', err.message);
    return next(err);
  }
};

const createTurf = async (req, res, next) => {
  try {
    console.log('[turfController] createTurf endpoint hit');
    console.log('[turfController] Request body:', req.body);
    console.log('[turfController] User:', req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const turf = await turfService.createTurf({
      ...req.body,
      owner_id: req.user.id,
      is_featured: false,
    });

    return res.status(201).json({
      success: true,
      data: turf,
    });
  } catch (err) {
    console.error('[turfController] createTurf error:', err.message);
    return next(err);
  }
};

module.exports = { getTurfs, getTurfById, createTurf };