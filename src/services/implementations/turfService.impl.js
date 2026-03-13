const turfRepo = require('../../repository/implementations/turfRepository.impl');
const Turf = require('../../models/Turf.model');

const getTurfs = async (filters = {}) => {
  try {
    console.log('[turfService] Fetching turfs with filters:', filters);

    const raw = await turfRepo.getTurfs(filters);
    const turfs = raw.map((t) => new Turf(t).toPublic());

    return turfs;
  } catch (error) {
    console.error('[turfService] getTurfs error:', error.message);
    throw error;
  }
};

const getTurfById = async (id) => {
  try {
    console.log('[turfService] Fetching turf:', id);

    const raw = await turfRepo.getTurfById(id);
    if (!raw) {
      const err = new Error('Turf not found');
      err.statusCode = 404;
      throw err;
    }

    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] getTurfById error:', error.message);
    throw error;
  }
};

const createTurf = async (data) => {
  try {
    console.log('[turfService] Creating turf');

    const now = new Date().toISOString();
    const raw = await turfRepo.createTurf({
      ...data,
      created_at: now,
      updated_at: now,
    });

    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] createTurf error:', error.message);
    throw error;
  }
};

module.exports = { getTurfs, getTurfById, createTurf };