const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const ownerBookingController = require('../controllers/ownerBookingController');
const authMiddleware = require('../middleware/auth.middleware');

// ===== USER BOOKING ROUTES =====
// Create new booking
router.post('/', authMiddleware, bookingController.createBooking);

// Get user's bookings
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);

// Get booking details
router.get('/:bookingId', authMiddleware, bookingController.getBookingDetails);

// ===== OWNER BOOKING MANAGEMENT ROUTES =====
// Get today's bookings
router.get('/owner/today', authMiddleware, ownerBookingController.getTodayBookings);

// Get all owner's bookings
router.get('/owner/all', authMiddleware, ownerBookingController.getOwnerBookings);

// Update booking status
router.put('/:bookingId/status', authMiddleware, ownerBookingController.updateBookingStatus);

// Cancel booking
router.put('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;