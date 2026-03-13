const bookingRepo = require('../../repository/implementations/bookingRepository.impl');
const Booking = require('../../models/Booking.model');

const createBooking = async (userId, turfId, bookingDate, startTime, endTime, totalPrice) => {
  try {
    console.log('[bookingService] Creating booking:', {
      userId,
      turfId,
      bookingDate,
      startTime,
      endTime,
    });

    const now = new Date().toISOString();
    const raw = await bookingRepo.createBooking({
      user_id: userId,
      turf_id: turfId,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice,
      status: 'confirmed',
      created_at: now,
      updated_at: now,
    });

    return new Booking(raw).toPublic();
  } catch (error) {
    console.error('[bookingService] createBooking error:', error.message);
    throw error;
  }
};

const getUserBookings = async (userId) => {
  try {
    console.log('[bookingService] Getting bookings for user:', userId);

    const raw = await bookingRepo.getBookingsByUserId(userId);
    return raw.map((b) => new Booking(b).toPublic());
  } catch (error) {
    console.error('[bookingService] getUserBookings error:', error.message);
    throw error;
  }
};

module.exports = { createBooking, getUserBookings };