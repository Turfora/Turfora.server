const turfRepo = require('../../repository/implementations/turfRepository.impl');
const bookingRepo = require('../../repository/implementations/bookingRepository.impl');
const revenueService = require('./revenueService.impl');

console.log('[OwnerService] Service loaded');

/**
 * Get all turfs for an owner
 */
const getTurfs = async (ownerId, limit = 50, offset = 0) => {
  try {
    console.log('[OwnerService] Getting turfs for owner:', ownerId);
    console.log('[OwnerService] Limit:', limit, 'Offset:', offset);

    const result = await turfRepo.findTurfsByOwnerId(ownerId, limit, offset);
    
    console.log('[OwnerService] Got turfs:', result);
    return result;
  } catch (error) {
    console.error('[OwnerService] Error in getTurfs:', error);
    throw error;
  }
};

/**
 * Get turf by ID
 */
const getTurfById = async (turfId, ownerId) => {
  try {
    console.log('[OwnerService] Getting turf:', turfId);
    return await turfRepo.findTurfById(turfId, ownerId);
  } catch (error) {
    console.error('[OwnerService] Error in getTurfById:', error);
    throw error;
  }
};

/**
 * Create a new turf
 */
const createTurf = async (data, ownerId) => {
  try {
    console.log('[OwnerService] Creating turf for owner:', ownerId);

    if (!data.name || !data.pricePerHour || !data.location) {
      const err = new Error('Missing required fields: name, pricePerHour, location');
      err.statusCode = 400;
      throw err;
    }

    return await turfRepo.createTurf({
      ...data,
      ownerId,
    });
  } catch (error) {
    console.error('[OwnerService] Error in createTurf:', error);
    throw error;
  }
};

/**
 * Update turf
 */
const updateTurf = async (turfId, data, ownerId) => {
  try {
    console.log('[OwnerService] Updating turf:', turfId);
    return await turfRepo.updateTurf(turfId, data, ownerId);
  } catch (error) {
    console.error('[OwnerService] Error in updateTurf:', error);
    throw error;
  }
};

/**
 * Delete turf
 */
const deleteTurf = async (turfId, ownerId) => {
  try {
    console.log('[OwnerService] Deleting turf:', turfId);
    return await turfRepo.deleteTurf(turfId, ownerId);
  } catch (error) {
    console.error('[OwnerService] Error in deleteTurf:', error);
    throw error;
  }
};

/**
 * Get turf statistics
 */
const getTurfStats = async (turfId, ownerId) => {
  try {
    console.log('[OwnerService] Getting turf stats');
    return await turfRepo.getTurfStats(turfId, ownerId);
  } catch (error) {
    console.error('[OwnerService] Error in getTurfStats:', error);
    throw error;
  }
};

/**
 * Get revenue stats
 */
const getRevenue = async (ownerId) => {
  try {
    console.log('[OwnerService] Getting revenue');
    return await revenueService.getRevenueStats(ownerId);
  } catch (error) {
    console.error('[OwnerService] Error in getRevenue:', error);
    throw error;
  }
};

/**
 * Get today's bookings
 */
const getTodayBookings = async (ownerId) => {
  try {
    console.log('[OwnerService] Getting today bookings');
    const bookings = await bookingRepo.findTodayBookings(ownerId);
    return {
      count: bookings.length,
      bookings,
    };
  } catch (error) {
    console.error('[OwnerService] Error in getTodayBookings:', error);
    throw error;
  }
};

/**
 * Get all bookings
 */
const getBookings = async (ownerId, limit = 50, offset = 0) => {
  try {
    console.log('[OwnerService] Getting bookings');
    return await bookingRepo.findBookingsByOwnerId(ownerId, limit, offset);
  } catch (error) {
    console.error('[OwnerService] Error in getBookings:', error);
    throw error;
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (bookingId, status, ownerId) => {
  try {
    console.log('[OwnerService] Updating booking status');

    if (!status) {
      const err = new Error('Status is required');
      err.statusCode = 400;
      throw err;
    }

    return await bookingRepo.updateBookingStatus(bookingId, status, ownerId);
  } catch (error) {
    console.error('[OwnerService] Error in updateBookingStatus:', error);
    throw error;
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
};