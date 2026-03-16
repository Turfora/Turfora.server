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
 * POST /api/owner/turfs/create
 * Create a new turf (owner only)
 */
const createTurf = async (req, res, next) => {
  try {
    console.log('[OwnerController] Creating turf');
    const ownerId = req.user.id;
    const data = req.body;

    const turf = await ownerService.createTurf(data, ownerId);

    return res.status(201).json({
      success: true,
      message: 'Turf created successfully',
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

/**
 * GET /api/owner/revenue
 * Get revenue statistics for owner
 */
const getRevenue = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting revenue');
    const ownerId = req.user.id;

    const revenue = await ownerService.getRevenue(ownerId);

    return res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/owner/bookings/today
 * Get today's bookings for owner
 */
const getTodayBookings = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting today bookings');
    const ownerId = req.user.id;

    const result = await ownerService.getTodayBookings(ownerId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/owner/bookings
 * Get all bookings for owner
 */
const getBookings = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting all bookings');
    const ownerId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await ownerService.getBookings(ownerId, limit, offset);

    return res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: { total: result.count, limit, offset },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/owner/bookings/:bookingId/status
 * Update booking status (owner only)
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    console.log('[OwnerController] Updating booking status');
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      const err = new Error('Status is required');
      err.statusCode = 400;
      throw err;
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const booking = await ownerService.updateBookingStatus(bookingId, status, ownerId);

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/owner/turfs/:ownerId
 * Get turfs for a specific owner (ownerId in path must match authenticated user)
 */
const getTurfsByOwnerId = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting turfs by ownerId');
    const { ownerId } = req.params;

    if (String(req.user.id) !== String(ownerId)) {
      const err = new Error('Unauthorized: You can only access your own turfs');
      err.statusCode = 403;
      throw err;
    }

    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const { turfs, count } = await ownerService.getTurfsByOwnerId(ownerId, limit, offset);

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
 * GET /api/owner/bookings/:ownerId
 * Get bookings for a specific owner (ownerId in path must match authenticated user)
 */
const getBookingsByOwnerId = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting bookings by ownerId');
    const { ownerId } = req.params;

    if (String(req.user.id) !== String(ownerId)) {
      const err = new Error('Unauthorized: You can only access your own bookings');
      err.statusCode = 403;
      throw err;
    }

    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await ownerService.getBookingsByOwnerId(ownerId, limit, offset);

    return res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: { total: result.count, limit, offset },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/owner/stats/:ownerId
 * Get dashboard statistics for a specific owner
 */
const getOwnerStats = async (req, res, next) => {
  try {
    console.log('[OwnerController] Getting owner stats');
    const { ownerId } = req.params;

    if (String(req.user.id) !== String(ownerId)) {
      const err = new Error('Unauthorized: You can only access your own stats');
      err.statusCode = 403;
      throw err;
    }

    const stats = await ownerService.getOwnerStats(ownerId);

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
  createTurf,
  updateTurf,
  deleteTurf,
  getTurfStats,
  getRevenue,
  getTodayBookings,
  getBookings,
  updateBookingStatus,
  getTurfsByOwnerId,
  getBookingsByOwnerId,
  getOwnerStats,
};