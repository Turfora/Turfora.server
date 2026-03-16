const express = require('express');
const router = express.Router();

const turfController = require('../controllers/turfController');
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middleware/auth.middleware');

// ===== PUBLIC ROUTES =====
// Get all turfs
router.get('/', turfController.getTurfs);

// Get popular turfs (must be before /:id)
router.get('/popular', turfController.getPopularTurfs);

// Get single turf by ID
router.get('/:id', turfController.getTurfById);

// ===== PROTECTED ROUTES (User/Owner Only) =====
// Create new turf
router.post('/', authMiddleware, turfController.createTurf);

// ===== OWNER-ONLY ROUTES =====
// Get owner's turfs
router.get('/owner/my-turfs', authMiddleware, ownerController.getTurfs);

// Get specific turf details (owner)
router.get('/owner/:turfId', authMiddleware, ownerController.getTurfById);

// Update turf
router.put('/:turfId', authMiddleware, ownerController.updateTurf);

// Delete turf
router.delete('/:turfId', authMiddleware, ownerController.deleteTurf);

// Get turf stats
router.get('/:turfId/stats', authMiddleware, ownerController.getTurfStats);

module.exports = router;    