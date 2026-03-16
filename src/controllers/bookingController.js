const bookingRepo = require('../repository/implementations/bookingRepository.impl');
const Booking = require('../models/Booking.model');

/**
 * Normalize time format from HH:MM to HH:MM:SS
 */
const normalizeTime = (time) => {
  if (!time) return null;
  
  if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return time;
  }
  
  if (time.match(/^\d{2}:\d{2}$/)) {
    return time + ':00';
  }
  
  throw new Error('Invalid time format. Use HH:MM or HH:MM:SS');
};

/**
 * POST /api/bookings
 * Create a new booking (user booking a turf)
 */
const createBooking = async (req, res, next) => {
  try {
    console.log('[BookingController] Creating new booking');
    const userId = req.user.id;
    const { turfId, bookingDate, startTime, endTime } = req.body;

    // Validate required fields
    if (!turfId || !bookingDate || !startTime || !endTime) {
      const err = new Error('Missing required fields: turfId, bookingDate, startTime, endTime');
      err.statusCode = 400;
      throw err;
    }

    // Normalize and validate time format
    let normalizedStartTime, normalizedEndTime;
    try {
      normalizedStartTime = normalizeTime(startTime);
      normalizedEndTime = normalizeTime(endTime);
    } catch (timeErr) {
      const err = new Error(timeErr.message);
      err.statusCode = 400;
      throw err;
    }

    // Validate start time is before end time
    if (normalizedStartTime >= normalizedEndTime) {
      const err = new Error('Start time must be before end time');
      err.statusCode = 400;
      throw err;
    }

    // Get turf details
    const db = require('../config/db.config');
    const { data: turf, error: turfError } = await db
      .from('turfs')
      .select('*')
      .eq('id', turfId)
      .single();

    if (turfError || !turf) {
      console.error('[BookingController] Turf error:', turfError);
      const err = new Error('Turf not found');
      err.statusCode = 404;
      throw err;
    }

    if (!turf.is_active) {
      const err = new Error('This turf is currently inactive');
      err.statusCode = 400;
      throw err;
    }

    // Calculate total_price
    const [startHour] = normalizedStartTime.split(':');
    const [endHour] = normalizedEndTime.split(':');
    const hoursCount = parseInt(endHour) - parseInt(startHour);

    if (hoursCount <= 0) {
      const err = new Error('Invalid booking duration');
      err.statusCode = 400;
      throw err;
    }

    const total_price = hoursCount * turf.price_per_hour;

    const bookingData = {
      turf_id: turfId,
      user_id: userId,
      booking_date: new Date(bookingDate).toISOString().split('T')[0],
      start_time: normalizedStartTime,
      end_time: normalizedEndTime,
      total_price,
      status: 'pending'
    };

    const booking = await bookingRepo.createBooking(bookingData);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (err) {
    console.error('[BookingController] Error in createBooking:', err.message);
    next(err);
  }
};

/**
 * GET /api/bookings/my-bookings
 * Get all bookings for logged-in user (FIXED: NO owner_id, NO RELATIONSHIP SYNTAX)
 */
const getUserBookings = async (req, res, next) => {
  try {
    console.log('[BookingController] Getting user bookings');
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status;

    const db = require('../config/db.config');

    // Step 1: Get bookings for user
    let query = db
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('booking_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('[BookingController] Error fetching bookings:', error);
      throw error;
    }

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { total: 0, limit, offset },
      });
    }

    // Step 2: Get turf details separately for each booking
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let turf = null;

        try {
          const { data: turfData } = await db
            .from('turfs')
            .select('id, name, location, image_url, price_per_hour, category')
            .eq('id', booking.turf_id)
            .single();
          turf = turfData;
        } catch (e) {
          console.log('[BookingController] Could not fetch turf:', booking.turf_id);
        }

        return {
          ...new Booking(booking).toPublic(),
          turf,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedBookings,
      pagination: { total: count, limit, offset },
    });
  } catch (err) {
    console.error('[BookingController] Error in getUserBookings:', err.message);
    next(err);
  }
};

/**
 * GET /api/bookings/:bookingId
 * Get booking details (FIXED: NO owner_id, NO RELATIONSHIP SYNTAX)
 */
const getBookingDetails = async (req, res, next) => {
  try {
    console.log('[BookingController] Getting booking details');
    const userId = req.user.id;
    const { bookingId } = req.params;

    const db = require('../config/db.config');

    // Step 1: Get booking
    const { data: booking, error } = await db
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('[BookingController] Booking error:', error);
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    // Check authorization - only user who created booking can view it
    if (booking.user_id !== userId) {
      const err = new Error('Unauthorized: You do not have access to this booking');
      err.statusCode = 403;
      throw err;
    }

    // Step 2: Get turf details
    const { data: turf } = await db
      .from('turfs')
      .select('id, name, description, location, price_per_hour, amenities, images')
      .eq('id', booking.turf_id)
      .single();

    // Step 3: Get booking user details
    const { data: user } = await db
      .from('users')
      .select('id, fullname, email, phone')
      .eq('id', booking.user_id)
      .single();

    const formattedBooking = {
      ...new Booking(booking).toPublic(),
      turf,
      user,
    };

    return res.status(200).json({
      success: true,
      data: formattedBooking,
    });
  } catch (err) {
    console.error('[BookingController] Error in getBookingDetails:', err.message);
    next(err);
  }
};

/**
 * PUT /api/bookings/:bookingId/cancel
 * Cancel a booking
 */
const cancelBooking = async (req, res, next) => {
  try {
    console.log('[BookingController] Cancelling booking');
    const userId = req.user.id;
    const { bookingId } = req.params;

    const db = require('../config/db.config');

    // Get booking
    const { data: booking, error: fetchError } = await db
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    // Only user who created booking can cancel
    if (booking.user_id !== userId) {
      const err = new Error('Unauthorized: You can only cancel your own bookings');
      err.statusCode = 403;
      throw err;
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      const err = new Error(`Cannot cancel a ${booking.status} booking`);
      err.statusCode = 400;
      throw err;
    }

    // Update status
    const { data: updated, error: updateError } = await db
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: new Booking(updated).toPublic(),
    });
  } catch (err) {
    console.error('[BookingController] Error in cancelBooking:', err.message);
    next(err);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
};