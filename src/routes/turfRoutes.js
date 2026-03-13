const express = require('express');
const router = express.Router();

const turfController = require('../controllers/turfController');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', turfController.getTurfs);
router.get('/:id', turfController.getTurfById);

// Protected routes
router.post('/', authMiddleware, turfController.createTurf);

module.exports = router;