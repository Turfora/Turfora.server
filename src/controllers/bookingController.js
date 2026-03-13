const bookingService = require('../services/implementations/bookingService.impl');

const createBooking = async (req, res, next) => {
  try {
    console.log('[bookingController] createBooking endpoint hit');
    console.log('[bookingController] Request body:', req.body);

    const { turfId, bookingDate, startTime, endTime, totalPrice } = req.body;
    const userId = req.user.id;

    const booking = await bookingService.createBooking(
      userId,
      turfId,
      bookingDate,
      startTime,
      endTime,
      totalPrice
    );

    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error('[bookingController] createBooking error:', err.message);
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    console.log('[bookingController] getUserBookings endpoint hit');

    const userId = req.user.id;
    const bookings = await bookingService.getUserBookings(userId);

    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error('[bookingController] getUserBookings error:', err.message);
    next(err);
  }
};

module.exports = { createBooking, getUserBookings };