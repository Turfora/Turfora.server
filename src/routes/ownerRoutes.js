const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middleware/auth.middleware');

const ownerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Apply rate limiting and authentication to all routes
router.use(ownerLimiter);
router.use(authMiddleware);

// TURF ROUTES
router.post('/turfs/create', ownerController.createTurf);
router.get('/turfs', ownerController.getTurfs);
router.put('/turfs/:turfId', ownerController.updateTurf);
router.delete('/turfs/:turfId', ownerController.deleteTurf);

// REVENUE ROUTES
router.get('/revenue', ownerController.getRevenue);

// BOOKING ROUTES
router.get('/bookings/today', ownerController.getTodayBookings);
router.get('/bookings', ownerController.getBookings);
router.put('/bookings/:bookingId/status', ownerController.updateBookingStatus);

// OWNER-ID PARAMETERISED ROUTES (used by frontend dashboard)
// Note: GET /api/turfs/:id and GET /api/turfs/:id/stats are available via turfRoutes
router.get('/turfs/:ownerId', ownerController.getTurfsByOwnerId);
router.get('/bookings/:ownerId', ownerController.getBookingsByOwnerId);
router.get('/stats/:ownerId', ownerController.getOwnerStats);

module.exports = router;