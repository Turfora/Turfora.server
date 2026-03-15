const supabase = require('../../config/db.config');
const Revenue = require('../../models/Revenue.model');

const TABLE = 'revenues';

/**
 * Create a new revenue record
 */
const createRevenue = async (data) => {
  console.log('[RevenueRepository] Creating revenue record');
  const now = new Date().toISOString();

  const { data: revenue, error } = await supabase
    .from(TABLE)
    .insert({
      owner_id: data.ownerId,
      turf_id: data.turfId,
      booking_id: data.bookingId,
      amount: data.amount,
      transaction_date: data.transactionDate,
      status: data.status || 'completed',
      notes: data.notes || null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return new Revenue(revenue).toPublic();
};

/**
 * Find revenue by ID
 */
const findRevenueById = async (id) => {
  console.log('[RevenueRepository] Finding revenue:', id);

  const { data: revenue, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return revenue ? new Revenue(revenue).toPublic() : null;
};

/**
 * Find revenues by owner ID with pagination
 */
const findRevenueByOwnerId = async (ownerId, limit = 50, offset = 0) => {
  console.log('[RevenueRepository] Finding revenues for owner:', ownerId);

  const { data: revenues, error, count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .eq('owner_id', ownerId)
    .is('deleted_at', null)
    .order('transaction_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return {
    revenues: (revenues || []).map(r => new Revenue(r).toPublic()),
    count,
  };
};

/**
 * Find revenues by turf ID with pagination
 */
const findRevenueByTurfId = async (turfId, limit = 50, offset = 0) => {
  console.log('[RevenueRepository] Finding revenues for turf:', turfId);

  const { data: revenues, error, count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .eq('turf_id', turfId)
    .is('deleted_at', null)
    .order('transaction_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return {
    revenues: (revenues || []).map(r => new Revenue(r).toPublic()),
    count,
  };
};

/**
 * Find revenues by date range
 */
const findRevenueByDateRange = async (ownerId, startDate, endDate) => {
  console.log('[RevenueRepository] Finding revenues by date range');

  const { data: revenues, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('owner_id', ownerId)
    .gte('transaction_date', new Date(startDate).toISOString().split('T')[0])
    .lte('transaction_date', new Date(endDate).toISOString().split('T')[0])
    .is('deleted_at', null)
    .order('transaction_date', { ascending: false });

  if (error) throw error;
  return (revenues || []).map(r => new Revenue(r).toPublic());
};

/**
 * Update revenue
 */
const updateRevenue = async (id, data) => {
  console.log('[RevenueRepository] Updating revenue:', id);

  const updateData = {
    updated_at: new Date().toISOString(),
  };

  if (data.status) updateData.status = data.status;
  if (data.notes) updateData.notes = data.notes;
  if (data.amount) updateData.amount = data.amount;

  const { data: revenue, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return new Revenue(revenue).toPublic();
};

/**
 * Get total revenue by owner
 */
const getTotalRevenueByOwner = async (ownerId) => {
  console.log('[RevenueRepository] Calculating total revenue for owner:', ownerId);

  const { data: revenues, error } = await supabase
    .from(TABLE)
    .select('amount')
    .eq('owner_id', ownerId)
    .eq('status', 'completed')
    .is('deleted_at', null);

  if (error) throw error;

  const total = (revenues || []).reduce((sum, r) => sum + (r.amount || 0), 0);
  return total;
};

/**
 * Get total revenue by turf
 */
const getTotalRevenueByTurf = async (turfId) => {
  console.log('[RevenueRepository] Calculating total revenue for turf:', turfId);

  const { data: revenues, error } = await supabase
    .from(TABLE)
    .select('amount')
    .eq('turf_id', turfId)
    .eq('status', 'completed')
    .is('deleted_at', null);

  if (error) throw error;

  const total = (revenues || []).reduce((sum, r) => sum + (r.amount || 0), 0);
  return total;
};

module.exports = {
  createRevenue,
  findRevenueById,
  findRevenueByOwnerId,
  findRevenueByTurfId,
  findRevenueByDateRange,
  updateRevenue,
  getTotalRevenueByOwner,
  getTotalRevenueByTurf,
};