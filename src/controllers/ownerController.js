const ownerService = require('../services/implementations/ownerService.impl');

/**
 * GET /api/turfs/owner/my-turfs
 * Get all turfs for logged-in owner
 */
const getTurfs = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting owner turfs');
    const ownerId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const { turfs, count } = await ownerService.getTurfs(ownerId, limit, offset);

    return res.status(200).json({
      success: true,
      data: turfs,
      pagination: { total: count, limit, offset },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/turfs/:turfId (owner)
 * Get specific turf details for owner
 */
const getTurfById = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting turf by ID');
    const ownerId = req.user.id;
    const { turfId } = req.params;

    const turf = await ownerService.getTurfById(turfId, ownerId);
    
    return res.status(200).json({
      success: true,
      data: turf,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/turfs/:turfId
 * Update turf (owner only)
 */
const updateTurf = async (req, res, next) => {
  try {
    console.log('[OwnerController] Updating turf');
    const ownerId = req.user.id;
    const { turfId } = req.params;
    const data = req.body;

    const turf = await ownerService.updateTurf(turfId, data, ownerId);

    return res.status(200).json({
      success: true,
      message: 'Turf updated successfully',
      data: turf,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/turfs/:turfId
 * Delete turf (owner only)
 */
const deleteTurf = async (req, res, next) => {
  try {
    console.log('[OwnerController] Deleting turf');
    const ownerId = req.user.id;
    const { turfId } = req.params;

    await ownerService.deleteTurf(turfId, ownerId);

    return res.status(200).json({
      success: true,
      message: 'Turf deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/turfs/:turfId/stats
 * Get turf statistics (owner only)
 */
const getTurfStats = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting turf stats');
    const ownerId = req.user.id;
    const { turfId } = req.params;

    const stats = await ownerService.getTurfStats(turfId, ownerId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTurfs,
  getTurfById,
  updateTurf,
  deleteTurf,
  getTurfStats,
};