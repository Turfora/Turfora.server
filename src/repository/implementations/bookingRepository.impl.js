const supabase = require('../../config/db.config');

const TABLE = 'bookings';

const createBooking = async (data) => {
  try {
    console.log('[bookingRepository] Creating booking:', data);

    const { data: booking, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('[bookingRepository] Supabase createBooking error:', error);
      throw error;
    }

    console.log('[bookingRepository] Booking created:', booking.id);
    return booking;
  } catch (error) {
    console.error('[bookingRepository] createBooking error:', error);
    throw error;
  }
};

const getBookingsByUserId = async (userId) => {
  try {
    console.log('[bookingRepository] Getting bookings for user:', userId);

    const { data: bookings, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[bookingRepository] Supabase getBookingsByUserId error:', error);
      throw error;
    }

    return bookings || [];
  } catch (error) {
    console.error('[bookingRepository] getBookingsByUserId error:', error);
    throw error;
  }
};

const getBookingById = async (id) => {
  try {
    const { data: booking, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return booking || null;
  } catch (error) {
    console.error('[bookingRepository] getBookingById error:', error);
    throw error;
  }
};

const updateBooking = async (id, data) => {
  try {
    const { data: booking, error } = await supabase
      .from(TABLE)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return booking;
  } catch (error) {
    console.error('[bookingRepository] updateBooking error:', error);
    throw error;
  }
};

module.exports = {
  createBooking,
  getBookingsByUserId,
  getBookingById,
  updateBooking,
};