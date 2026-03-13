const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);

module.exports = router;