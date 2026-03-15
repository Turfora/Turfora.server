/**
 * Contract (interface) for the revenue repository.
 */
module.exports = {
  createRevenue: async (data) => {},
  findRevenueById: async (id) => {},
  findRevenueByOwnerId: async (ownerId, limit, offset) => {},
  findRevenueByTurfId: async (turfId, limit, offset) => {},
  findRevenueByDateRange: async (ownerId, startDate, endDate) => {},
  updateRevenue: async (id, data) => {},
  getTotalRevenueByOwner: async (ownerId) => {},
  getTotalRevenueByTurf: async (turfId) => {},
};