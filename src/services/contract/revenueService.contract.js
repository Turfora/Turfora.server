/**
 * Contract (interface) for the revenue service.
 */
module.exports = {
  calculateTotalRevenue: async (ownerId) => {},
  calculateTodayRevenue: async (ownerId) => {},
  calculateYesterdayRevenue: async (ownerId) => {},
  calculateMonthlyRevenue: async (ownerId, month, year) => {},
  getRevenueStats: async (ownerId) => {},
  getRevenueByTurf: async (ownerId, turfId) => {},
  getRevenueByDateRange: async (ownerId, startDate, endDate) => {},
  createRevenueFromBooking: async (booking) => {},
};