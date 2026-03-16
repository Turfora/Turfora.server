const supabase = require('../../config/db.config');
const Booking = require('../../models/Booking.model');

const TABLE = 'bookings';

/**
 * Create a new booking
 */
const createBooking = async (data) => {
  console.log('[BookingRepository] Creating booking');
  const now = new Date().toISOString();

  const { data: booking, error } = await supabase
    .from(TABLE)
    .insert({
      turf_id: data.turf_id,
      user_id: data.user_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      amount: data.amount,
      status: data.status || 'pending',
      notes: data.notes || null,
      is_active: data.is_active !== false,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return new Booking(booking).toPublic();
};

/**
 * Find booking by ID
 */
const findBookingById = async (id) => {
  console.log('[BookingRepository] Finding booking:', id);

  const { data: booking, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return booking ? new Booking(booking).toPublic() : null;
};

/**
 * Find today's bookings for an owner - WITHOUT FK JOINS
 */
const findTodayBookings = async (ownerId) => {
  console.log('[BookingRepository] Finding today bookings for owner:', ownerId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  try {
    // Step 1: Get all turfs owned by this owner
    const { data: turfs, error: turfError } = await supabase
      .from('turfs')
      .select('id')
      .eq('owner_id', ownerId)
      .is('deleted_at', null);

    if (turfError) {
      console.error('[BookingRepository] Error fetching turfs:', turfError);
      throw turfError;
    }

    if (!turfs || turfs.length === 0) {
      console.log('[BookingRepository] No turfs found for owner:', ownerId);
      return [];
    }

    const turfIds = turfs.map(t => t.id);

    // Step 2: Get bookings for those turfs
    const { data: bookings, error } = await supabase
      .from(TABLE)
      .select('*')
      .in('turf_id', turfIds)
      .gte('booking_date', todayStr)
      .lt('booking_date', tomorrowStr)
      .is('deleted_at', null)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('[BookingRepository] Error fetching bookings:', error);
      throw error;
    }

    console.log('[BookingRepository] Found bookings:', bookings?.length);

    // Step 2: Fetch turf and user details separately if needed
    const enrichedBookings = await Promise.all(
      (bookings || []).map(async (b) => {
        let turfName = 'Unknown';
        let userName = 'Unknown';

        try {
          // Fetch turf name
          const { data: turf } = await supabase
            .from('turfs')
            .select('name')
            .eq('id', b.turf_id)
            .single();
          
          if (turf) turfName = turf.name;
        } catch (e) {
          console.log('[BookingRepository] Could not fetch turf name');
        }

        try {
          // Fetch user name
          const { data: user } = await supabase
            .from('users')
            .select('fullname')
            .eq('id', b.user_id)
            .single();
          
          if (user) userName = user.fullname;
        } catch (e) {
          console.log('[BookingRepository] Could not fetch user name');
        }

        return {
          ...new Booking(b).toPublic(),
          turfName,
          userName,
        };
      })
    );

    return enrichedBookings;
  } catch (error) {
    console.error('[BookingRepository] Error in findTodayBookings:', error);
    throw error;
  }
};

/**
 * Find all bookings for an owner with pagination - WITHOUT FK JOINS
 */
const findBookingsByOwnerId = async (ownerId, limit = 50, offset = 0) => {
  console.log('[BookingRepository] Finding bookings for owner:', ownerId);

  try {
    // Step 1: Get all turfs owned by this owner
    const { data: turfs, error: turfError } = await supabase
      .from('turfs')
      .select('id')
      .eq('owner_id', ownerId)
      .is('deleted_at', null);

    if (turfError) {
      console.error('[BookingRepository] Error fetching turfs:', turfError);
      throw turfError;
    }

    if (!turfs || turfs.length === 0) {
      console.log('[BookingRepository] No turfs found for owner:', ownerId);
      return { bookings: [], count: 0 };
    }

    const turfIds = turfs.map(t => t.id);

    // Step 2: Get bookings for those turfs
    const { data: bookings, error, count } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .in('turf_id', turfIds)
      .is('deleted_at', null)
      .order('booking_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[BookingRepository] Error fetching bookings:', error);
      throw error;
    }

    console.log('[BookingRepository] Found bookings:', bookings?.length);

    // Step 3: Fetch turf and user details separately
    const enrichedBookings = await Promise.all(
      (bookings || []).map(async (b) => {
        let turfName = 'Unknown';
        let userName = 'Unknown';

        try {
          const { data: turf } = await supabase
            .from('turfs')
            .select('name')
            .eq('id', b.turf_id)
            .single();
          
          if (turf) turfName = turf.name;
        } catch (e) {
          console.log('[BookingRepository] Could not fetch turf name');
        }

        try {
          const { data: user } = await supabase
            .from('users')
            .select('fullname')
            .eq('id', b.user_id)
            .single();
          
          if (user) userName = user.fullname;
        } catch (e) {
          console.log('[BookingRepository] Could not fetch user name');
        }

        return {
          ...new Booking(b).toPublic(),
          turfName,
          userName,
        };
      })
    );

    return {
      bookings: enrichedBookings,
      count,
    };
  } catch (error) {
    console.error('[BookingRepository] Error in findBookingsByOwnerId:', error);
    throw error;
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (id, status, ownerId) => {
  console.log('[BookingRepository] Updating booking status:', id);

  // Verify that the booking belongs to a turf owned by this owner
  const { data: booking, error: fetchError } = await supabase
    .from(TABLE)
    .select('id, turf_id')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (fetchError || !booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const { data: turf, error: turfError } = await supabase
    .from('turfs')
    .select('id')
    .eq('id', booking.turf_id)
    .eq('owner_id', ownerId)
    .is('deleted_at', null)
    .single();

  if (turfError || !turf) {
    const err = new Error('Booking not found or you are not the owner');
    err.statusCode = 404;
    throw err;
  }

  const { data: updatedBooking, error } = await supabase
    .from(TABLE)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!updatedBooking) {
    const err = new Error('Booking not found or you are not the owner');
    err.statusCode = 404;
    throw err;
  }

  return new Booking(updatedBooking).toPublic();
};

/**
 * Get bookings by date range - WITHOUT FK JOINS
 */
const getBookingsByDateRange = async (ownerId, startDate, endDate) => {
  console.log('[BookingRepository] Getting bookings by date range');

  try {
    const startStr = new Date(startDate).toISOString().split('T')[0];
    const endStr = new Date(endDate).toISOString().split('T')[0];

    // Step 1: Get all turfs owned by this owner
    const { data: turfs, error: turfError } = await supabase
      .from('turfs')
      .select('id')
      .eq('owner_id', ownerId)
      .is('deleted_at', null);

    if (turfError) throw turfError;

    if (!turfs || turfs.length === 0) {
      return [];
    }

    const turfIds = turfs.map(t => t.id);

    // Step 2: Get bookings for those turfs within the date range
    const { data: bookings, error } = await supabase
      .from(TABLE)
      .select('*')
      .in('turf_id', turfIds)
      .gte('booking_date', startStr)
      .lte('booking_date', endStr)
      .is('deleted_at', null)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return (bookings || []).map(b => new Booking(b).toPublic());
  } catch (error) {
    console.error('[BookingRepository] Error in getBookingsByDateRange:', error);
    throw error;
  }
};

module.exports = {
  createBooking,
  findBookingById,
  findTodayBookings,
  findBookingsByOwnerId,
  updateBookingStatus,
  getBookingsByDateRange,
};