const bookingRepo = require('../repository/implementations/bookingRepository.impl');
const Booking = require('../models/Booking.model');

/**
 * GET /api/bookings/owner/today
 * Get today's bookings for owner
 */
const getTodayBookings = async (req, res, next) => {
  try {
    console.log('[OwnerBookingController] Getting today bookings');
    const ownerId = req.user.id;

    const bookings = await bookingRepo.findTodayBookings(ownerId);

    const formattedBookings = bookings.map(b => ({
      ...b,
    }));

    return res.status(200).json({
      success: true,
      data: {
        count: formattedBookings.length,
        bookings: formattedBookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/owner/all
 * Get all bookings for owner with pagination
 */
const getOwnerBookings = async (req, res, next) => {
  try {
    console.log('[OwnerBookingController] Getting owner bookings');
    const ownerId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status; // Optional filter

    let query = require('../config/db.config')
      .from('bookings')
      .select(`
        *,
        turf:turfs(id, name, location, price_per_hour),
        user:users(id, fullname, email, phone)
      `, { count: 'exact' })
      .eq('owner_id', ownerId)
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
      turfPrice: b.turf?.price_per_hour,
      userName: b.user?.fullname,
      userEmail: b.user?.email,
      userPhone: b.user?.phone,
    }));

    return res.status(200).json({
      success: true,
      data: formattedBookings,
      pagination: { total: count, limit, offset },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/bookings/:bookingId/status
 * Update booking status (owner only)
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    console.log('[OwnerBookingController] Updating booking status');
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      const err = new Error('Status is required');
      err.statusCode = 400;
      throw err;
    }

    // Valid statuses
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const booking = await bookingRepo.updateBookingStatus(bookingId, status, ownerId);

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/:bookingId
 * Get booking details (owner or user who made booking)
 */
const getBookingById = async (req, res, next) => {
  try {
    console.log('[OwnerBookingController] Getting booking details');
    const userId = req.user.id;
    const { bookingId } = req.params;

    const { data: booking, error } = await require('../config/db.config')
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
    next(err);
  }
};

module.exports = {
  getTodayBookings,
  getOwnerBookings,
  updateBookingStatus,
  getBookingById,
};