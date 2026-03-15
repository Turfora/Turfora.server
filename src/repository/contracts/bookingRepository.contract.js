/**
 * Contract (interface) for the booking repository.
 */
module.exports = {
  createBooking: async (data) => {},
  findBookingById: async (id) => {},
  findTodayBookings: async (ownerId) => {},
  findBookingsByOwnerId: async (ownerId, limit, offset) => {},
  updateBookingStatus: async (id, status, ownerId) => {},
  getBookingsByDateRange: async (ownerId, startDate, endDate) => {},
};