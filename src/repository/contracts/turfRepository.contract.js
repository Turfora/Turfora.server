/**
 * Contract (interface) for the turf repository.
 */
module.exports = {
  createTurf: async (data) => {},
  findTurfById: async (id) => {},
  findTurfsByOwnerId: async (ownerId, limit, offset) => {},
  updateTurf: async (id, data) => {},
  deleteTurf: async (id) => {},
  getAllTurfs: async (category, limit, offset) => {},
  getTurfStats: async (turfId, ownerId) => {},
};