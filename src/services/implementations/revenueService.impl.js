const supabase = require('../../config/db.config');
const revenueRepo = require('../../repository/implementations/revenueRepository.impl');

/**
 * Calculate total revenue for an owner (from completed bookings)
 */
const calculateTotalRevenue = async (ownerId) => {
  console.log('[RevenueService] Calculating total revenue');

  const { data: turfs, error: turfError } = await supabase
    .from('turfs')
    .select('id')
    .eq('owner_id', ownerId)

  if (turfError) throw turfError;
  if (!turfs || turfs.length === 0) return 0;

  const turfIds = turfs.map(t => t.id);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('amount')
    .in('turf_id', turfIds)
    .in('status', ['completed', 'confirmed'])

  if (error) throw error;

  const total = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);
  return total;
};

/**
 * Calculate today's revenue
 */
const calculateTodayRevenue = async (ownerId) => {
  console.log('[RevenueService] Calculating today revenue');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: turfs, error: turfError } = await supabase
    .from('turfs')
    .select('id')
    .eq('owner_id', ownerId)

  if (turfError) throw turfError;
  if (!turfs || turfs.length === 0) return 0;

  const turfIds = turfs.map(t => t.id);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('amount')
    .in('turf_id', turfIds)
    .in('status', ['completed', 'confirmed'])
    .gte('booking_date', today.toISOString().split('T')[0])
    .lt('booking_date', tomorrow.toISOString().split('T')[0])

  if (error) throw error;

  const total = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);
  return total;
};

/**
 * Calculate yesterday's revenue
 */
const calculateYesterdayRevenue = async (ownerId) => {
  console.log('[RevenueService] Calculating yesterday revenue');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const { data: turfs, error: turfError } = await supabase
    .from('turfs')
    .select('id')
    .eq('owner_id', ownerId)

  if (turfError) throw turfError;
  if (!turfs || turfs.length === 0) return 0;

  const turfIds = turfs.map(t => t.id);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('amount')
    .in('turf_id', turfIds)
    .in('status', ['completed', 'confirmed'])
    .gte('booking_date', yesterday.toISOString().split('T')[0])
    .lt('booking_date', today.toISOString().split('T')[0])

  if (error) throw error;

  const total = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);
  return total;
};

/**
 * Calculate monthly revenue
 */
const calculateMonthlyRevenue = async (ownerId, month, year) => {
  console.log('[RevenueService] Calculating monthly revenue');

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data: turfs, error: turfError } = await supabase
    .from('turfs')
    .select('id')
    .eq('owner_id', ownerId)

  if (turfError) throw turfError;
  if (!turfs || turfs.length === 0) return 0;

  const turfIds = turfs.map(t => t.id);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('amount')
    .in('turf_id', turfIds)
    .in('status', ['completed', 'confirmed'])
    .gte('booking_date', startDate.toISOString().split('T')[0])
    .lte('booking_date', endDate.toISOString().split('T')[0])

  if (error) throw error;

  const total = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);
  return total;
};

/**
 * Get complete revenue stats
 */
const getRevenueStats = async (ownerId) => {
  console.log('[RevenueService] Getting revenue stats');

  const [totalRevenue, todayRevenue, yesterdayRevenue] = await Promise.all([
    calculateTotalRevenue(ownerId),
    calculateTodayRevenue(ownerId),
    calculateYesterdayRevenue(ownerId),
  ]);

  const todayRevenuePercentage =
    yesterdayRevenue === 0
      ? 0
      : Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 10000) / 100;

  return {
    totalRevenue,
    todayRevenue,
    yesterdayRevenue,
    todayRevenuePercentage,
  };
};

/**
 * Get revenue for a specific turf
 */
const getRevenueByTurf = async (ownerId, turfId) => {
  console.log('[RevenueService] Calculating revenue for turf:', turfId);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('amount')
    .eq('turf_id', turfId)
    .in('status', ['completed', 'confirmed'])

  if (error) throw error;

  const revenue = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);
  return revenue;
};

/**
 * Get revenue by date range
 */
const getRevenueByDateRange = async (ownerId, startDate, endDate) => {
  console.log('[RevenueService] Getting revenue by date range');

  const { data: turfs, error: turfError } = await supabase
    .from('turfs')
    .select('id')
    .eq('owner_id', ownerId)

  if (turfError) throw turfError;

  if (!turfs || turfs.length === 0) {
    return {
      startDate,
      endDate,
      revenue: 0,
      bookingCount: 0,
      averagePerBooking: 0,
    };
  }

  const turfIds = turfs.map(t => t.id);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('amount')
    .in('turf_id', turfIds)
    .in('status', ['completed', 'confirmed'])
    .gte('booking_date', new Date(startDate).toISOString().split('T')[0])
    .lte('booking_date', new Date(endDate).toISOString().split('T')[0])

  if (error) throw error;

  const revenue = (bookings || []).reduce((sum, b) => sum + (b.amount || 0), 0);
  const bookingCount = bookings?.length || 0;

  return {
    startDate,
    endDate,
    revenue,
    bookingCount,
    averagePerBooking: bookingCount > 0 ? (revenue / bookingCount).toFixed(2) : 0,
  };
};

/**
 * Create revenue record from booking
 */
const createRevenueFromBooking = async (booking) => {
  console.log('[RevenueService] Creating revenue from booking');

  if (booking.status !== 'completed') {
    console.log('[RevenueService] Booking not completed, skipping revenue creation');
    return null;
  }

  const revenueData = {
    ownerId: booking.owner_id,
    turfId: booking.turf_id,
    bookingId: booking.id,
    amount: booking.amount,
    transactionDate: booking.booking_date,
    status: 'completed',
    notes: `Revenue from booking ${booking.id}`,
  };

  return revenueRepo.createRevenue(revenueData);
};

module.exports = {
  calculateTotalRevenue,
  calculateTodayRevenue,
  calculateYesterdayRevenue,
  calculateMonthlyRevenue,
  getRevenueStats,
  getRevenueByTurf,
  getRevenueByDateRange,
  createRevenueFromBooking,
};