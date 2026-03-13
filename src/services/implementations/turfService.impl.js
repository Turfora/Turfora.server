const getTurfs = async (filters = {}) => {
  try {
    console.log('[turfService] Fetching turfs with filters:', filters);

    const turfRepo = require('../../repository/implementations/turfRepository.impl');
    const raw = await turfRepo.getTurfs(filters);

    console.log('[turfService] Retrieved turfs from repo:', raw.length);

    // If no turfs in database, return empty array
    if (!raw || raw.length === 0) {
      console.log('[turfService] No turfs found in database');
      return [];
    }

    // Map to Turf model instances
    const Turf = require('../../models/Turf.model');
    const turfs = raw.map((t) => {
      try {
        return new Turf(t).toPublic();
      } catch (err) {
        console.error('[turfService] Error mapping turf:', err.message, 'turf data:', t);
        return null;
      }
    }).filter(t => t !== null);

    console.log('[turfService] Mapped', turfs.length, 'turfs');
    return turfs;
  } catch (error) {
    console.error('[turfService] getTurfs error:', error.message);
    console.error('[turfService] Error stack:', error.stack);
    throw error;
  }
};

const getTurfById = async (id) => {
  try {
    console.log('[turfService] Fetching turf by id:', id);

    const turfRepo = require('../../repository/implementations/turfRepository.impl');
    const raw = await turfRepo.getTurfById(id);

    if (!raw) {
      console.log('[turfService] Turf not found:', id);
      return null;
    }

    const Turf = require('../../models/Turf.model');
    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] getTurfById error:', error.message);
    throw error;
  }
};

const createTurf = async (data) => {
  try {
    console.log('[turfService] Creating turf with data:', data);

    const turfRepo = require('../../repository/implementations/turfRepository.impl');
    const now = new Date().toISOString();

    const raw = await turfRepo.createTurf({
      ...data,
      created_at: now,
      updated_at: now,
    });

    console.log('[turfService] Turf created:', raw.id);

    const Turf = require('../../models/Turf.model');
    return new Turf(raw).toPublic();
  } catch (error) {
    console.error('[turfService] createTurf error:', error.message);
    throw error;
  }
};

module.exports = { getTurfs, getTurfById, createTurf };