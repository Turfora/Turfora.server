const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authenticate } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticate);

// TURF ROUTES
router.post('/turfs/create', ownerController.createTurf);
router.get('/turfs', ownerController.getTurfs);
router.get('/turfs/:turfId', ownerController.getTurfById);
router.put('/turfs/:turfId', ownerController.updateTurf);
router.delete('/turfs/:turfId', ownerController.deleteTurf);
router.get('/turfs/:turfId/stats', ownerController.getTurfStats);

// REVENUE ROUTES
router.get('/revenue', ownerController.getRevenue);

// BOOKING ROUTES
router.get('/bookings/today', ownerController.getTodayBookings);
router.get('/bookings', ownerController.getBookings);
router.put('/bookings/:bookingId/status', ownerController.updateBookingStatus);

module.exports = router;