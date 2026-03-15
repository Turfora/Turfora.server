const express = require('express');
const router = express.Router();

const revenueController = require('../controllers/revenueController');
const authMiddleware = require('../middleware/auth.middleware');

// All revenue routes are protected
router.use(authMiddleware);

// Get overall revenue stats
router.get('/', revenueController.getRevenue);

// Get revenue for specific turf
router.get('/turf/:turfId', revenueController.getTurfRevenue);

// Get revenue by date range
router.get('/date-range', revenueController.getRevenueByDateRange);

module.exports = router;