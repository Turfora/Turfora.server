const bookingRepo = require('../repository/implementations/bookingRepository.impl');
const Booking = require('../models/Booking.model');

/**
 * Normalize time format from HH:MM to HH:MM:SS
 */
const normalizeTime = (time) => {
  if (!time) return null;
  
  // If already HH:MM:SS, return as is
  if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return time;
  }
  
  // If HH:MM, add :00 for seconds
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
    const { turfId, bookingDate, startTime, endTime, notes } = req.body;

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

    console.log('[BookingController] Normalized times:', {
      startTime: normalizedStartTime,
      endTime: normalizedEndTime,
    });

    // Validate start time is before end time
    if (normalizedStartTime >= normalizedEndTime) {
      const err = new Error('Start time must be before end time');
      err.statusCode = 400;
      throw err;
    }

    // Get turf details to get owner ID and calculate amount
    const db = require('../config/db.config');
    const { data: turf, error: turfError } = await db
      .from('turfs')
      .select('*')
      .eq('id', turfId)
      .is('deleted_at', null)
      .single();

    if (turfError || !turf) {
      console.error('[BookingController] Turf error:', turfError);
      const err = new Error('Turf not found');
      err.statusCode = 404;
      throw err;
    }

    console.log('[BookingController] Turf found:', turf.id, 'is_active:', turf.is_active);

    if (!turf.is_active) {
      const err = new Error('This turf is currently inactive');
      err.statusCode = 400;
      throw err;
    }

    // Calculate amount based on price per hour
    const [startHour] = normalizedStartTime.split(':');
    const [endHour] = normalizedEndTime.split(':');
    const hoursCount = parseInt(endHour) - parseInt(startHour);
    
    if (hoursCount <= 0) {
      const err = new Error('Invalid booking duration');
      err.statusCode = 400;
      throw err;
    }

    const amount = hoursCount * turf.price_per_hour;

    console.log('[BookingController] Booking calculation:', {
      startHour,
      endHour,
      hoursCount,
      pricePerHour: turf.price_per_hour,
      amount,
    });

    const bookingData = {
      turf_id: turfId,
      user_id: userId,
      owner_id: turf.owner_id,
      booking_date: new Date(bookingDate).toISOString().split('T')[0], // Ensure date format
      start_time: normalizedStartTime,
      end_time: normalizedEndTime,
      amount,
      notes: notes || null,
      status: 'pending',
      is_active: true,
    };

    console.log('[BookingController] Booking data:', bookingData);

    const booking = await bookingRepo.createBooking(bookingData);

    console.log('[BookingController] Booking created:', booking.id);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: new Booking(booking).toPublic(),
    });
  } catch (err) {
    console.error('[BookingController] Error in createBooking:', err.message);
    next(err);
  }
};

/**
 * GET /api/bookings/my-bookings
 * Get all bookings for logged-in user
 */
const getUserBookings = async (req, res, next) => {
  try {
    console.log('[BookingController] Getting user bookings');
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status; // Optional filter by status

    const db = require('../config/db.config');
    let query = db
      .from('bookings')
      .select(`
        *,
        turf:turfs(id, name, location, image_url, price_per_hour, category),
        owner:users(id, fullname, phone)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('booking_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    const formattedBookings = (bookings || []).map(b => ({
      ...new Booking(b).toPublic(),
      turfName: b.turf?.name,
      turfLocation: b.turf?.location,
      turfImage: b.turf?.image_url,
      turfPrice: b.turf?.price_per_hour,
      turfCategory: b.turf?.category,
      ownerName: b.owner?.fullname,
      ownerPhone: b.owner?.phone,
    }));

    return res.status(200).json({
      success: true,
      data: formattedBookings,
      pagination: { total: count, limit, offset },
    });
  } catch (err) {
    console.error('[BookingController] Error in getUserBookings:', err.message);
    next(err);
  }
};

/**
 * GET /api/bookings/:bookingId
 * Get booking details
 */
const getBookingDetails = async (req, res, next) => {
  try {
    console.log('[BookingController] Getting booking details');
    const userId = req.user.id;
    const { bookingId } = req.params;

    const db = require('../config/db.config');
    const { data: booking, error } = await db
      .from('bookings')
      .select(`
        *,
        turf:turfs(id, name, description, location, price_per_hour, amenities, images),
        user:users(id, fullname, email, phone),
        owner:users(id, fullname, email, phone)
      `)
      .eq('id', bookingId)
      .is('deleted_at', null)
      .single();

    if (error || !booking) {
      console.error('[BookingController] Booking error:', error);
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    // Check if user is owner or booking creator
    if (booking.user_id !== userId && booking.owner_id !== userId) {
      const err = new Error('Unauthorized: You do not have access to this booking');
      err.statusCode = 403;
      throw err;
    }

    const formattedBooking = {
      ...new Booking(booking).toPublic(),
      turf: booking.turf,
      user: {
        id: booking.user.id,
        fullname: booking.user.fullname,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      owner: {
        id: booking.owner.id,
        fullname: booking.owner.fullname,
        email: booking.owner.email,
        phone: booking.owner.phone,
      },
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
 * Cancel a booking (user can only cancel their own)
 */
const cancelBooking = async (req, res, next) => {
  try {
    console.log('[BookingController] Cancelling booking');
    const userId = req.user.id;
    const { bookingId } = req.params;

    const db = require('../config/db.config');
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

    console.log('[BookingController] Booking cancelled:', bookingId);

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