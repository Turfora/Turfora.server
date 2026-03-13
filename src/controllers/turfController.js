const turfService = require('../services/implementations/turfService.impl');

const getTurfs = async (req, res, next) => {
  try {
    console.log('[turfController] getTurfs endpoint hit');
    console.log('[turfController] Query params:', req.query);

    const filters = {
      category: req.query.category,
      is_featured: req.query.featured === 'true',
    };

    const turfs = await turfService.getTurfs(filters);
    return res.status(200).json({ success: true, data: turfs });
  } catch (err) {
    console.error('[turfController] getTurfs error:', err.message);
    next(err);
  }
};

const getTurfById = async (req, res, next) => {
  try {
    console.log('[turfController] getTurfById endpoint hit, id:', req.params.id);

    const turf = await turfService.getTurfById(req.params.id);
    return res.status(200).json({ success: true, data: turf });
  } catch (err) {
    console.error('[turfController] getTurfById error:', err.message);
    next(err);
  }
};

const createTurf = async (req, res, next) => {
  try {
    console.log('[turfController] createTurf endpoint hit');
    console.log('[turfController] Request body:', req.body);

    const turf = await turfService.createTurf({
      ...req.body,
      owner_id: req.user.id,
      is_featured: false,
    });

    return res.status(201).json({ success: true, data: turf });
  } catch (err) {
    console.error('[turfController] createTurf error:', err.message);
    next(err);
  }
};

module.exports = { getTurfs, getTurfById, createTurf };