const { db } = require('../config/supabase')

class TurfModel {
  static async create(data, ownerId) {
    try {
      console.log('[TurfModel] Creating turf for owner:', ownerId)
      const { data: turf, error } = await db
        .from('turfs')
        .insert({
          owner_id: ownerId,
          name: data.name,
          description: data.description,
          location: data.location,
          category: data.category,
          price_per_hour: data.price_per_hour,
          opening_time: data.opening_time,
          closing_time: data.closing_time,
          phone_number: data.phone_number,
          amenities: data.amenities,
          image_url: data.images?.[0] || null,
          images: data.images || [],
          videos: data.videos || [],
          is_active: true,
        })
        .select()

      if (error) throw error
      console.log('[TurfModel] Turf created:', turf)
      return turf[0]
    } catch (error) {
      console.error('[TurfModel] Error creating turf:', error)
      throw error
    }
  }

  static async getByOwnerId(ownerId, limit = 50, offset = 0) {
    try {
      console.log('[TurfModel] Fetching turfs for owner:', ownerId)
      const { data, error, count } = await db
        .from('turfs')
        .select('*', { count: 'exact' })
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      console.log('[TurfModel] Found turfs:', data?.length)
      return { data, count }
    } catch (error) {
      console.error('[TurfModel] Error fetching turfs:', error)
      throw error
    }
  }

  static async getById(turfId, ownerId = null) {
    try {
      console.log('[TurfModel] Fetching turf:', turfId)
      let query = db.from('turfs').select('*').eq('id', turfId)

      if (ownerId) {
        query = query.eq('owner_id', ownerId)
      }

      const { data, error } = await query

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Turf not found')
      }
      console.log('[TurfModel] Turf found:', data[0].name)
      return data[0]
    } catch (error) {
      console.error('[TurfModel] Error fetching turf:', error)
      throw error
    }
  }

  static async update(turfId, data, ownerId) {
    try {
      console.log('[TurfModel] Updating turf:', turfId)
      const { data: turf, error } = await db
        .from('turfs')
        .update({
          name: data.name,
          description: data.description,
          location: data.location,
          category: data.category,
          price_per_hour: data.price_per_hour,
          opening_time: data.opening_time,
          closing_time: data.closing_time,
          phone_number: data.phone_number,
          amenities: data.amenities,
          image_url: data.images?.[0] || undefined,
          images: data.images || undefined,
          videos: data.videos || undefined,
          updated_at: new Date(),
        })
        .eq('id', turfId)
        .eq('owner_id', ownerId)
        .select()

      if (error) throw error
      if (!turf || turf.length === 0) {
        throw new Error('Turf not found or you are not the owner')
      }
      console.log('[TurfModel] Turf updated')
      return turf[0]
    } catch (error) {
      console.error('[TurfModel] Error updating turf:', error)
      throw error
    }
  }

  static async delete(turfId, ownerId) {
    try {
      console.log('[TurfModel] Deleting turf:', turfId)
      const { error } = await db
        .from('turfs')
        .update({ is_active: false })
        .eq('id', turfId)
        .eq('owner_id', ownerId)

      if (error) throw error
      console.log('[TurfModel] Turf deleted')
      return true
    } catch (error) {
      console.error('[TurfModel] Error deleting turf:', error)
      throw error
    }
  }

  static async getAllTurfs(category = null, limit = 50, offset = 0) {
    try {
      console.log('[TurfModel] Fetching all turfs')
      let query = db
        .from('turfs')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error, count } = await query.range(offset, offset + limit - 1)

      if (error) throw error
      console.log('[TurfModel] Found turfs:', data?.length)
      return { data, count }
    } catch (error) {
      console.error('[TurfModel] Error fetching turfs:', error)
      throw error
    }
  }

  static async getTurfStats(turfId, ownerId) {
    try {
      console.log('[TurfModel] Getting turf stats:', turfId)
      const turf = await this.getById(turfId, ownerId)

      // Get bookings count
      const { data: bookings, error: bookingsError } = await db
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('turf_id', turfId)

      if (bookingsError) throw bookingsError

      // Calculate revenue
      let revenue = 0
      if (bookings && bookings.length > 0) {
        revenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)
      }

      return {
        turfId,
        turfName: turf.name,
        bookingsCount: bookings?.length || 0,
        totalRevenue: revenue,
        price: turf.price_per_hour,
      }
    } catch (error) {
      console.error('[TurfModel] Error getting turf stats:', error)
      throw error
    }
  }
}

module.exports = TurfModel