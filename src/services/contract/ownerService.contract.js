/**
 * Contract (interface) for the owner service.
 */
module.exports = {
  createTurf: async (data, ownerId) => {},
  getTurfs: async (ownerId, limit, offset) => {},
  getTurfById: async (turfId, ownerId) => {},
  updateTurf: async (turfId, data, ownerId) => {},
  deleteTurf: async (turfId, ownerId) => {},
  getTurfStats: async (turfId, ownerId) => {},
  getRevenue: async (ownerId) => {},
  getTodayBookings: async (ownerId) => {},
  getBookings: async (ownerId, limit, offset) => {},
  updateBookingStatus: async (bookingId, status, ownerId) => {},
};