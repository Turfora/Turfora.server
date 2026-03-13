/**
 * Booking model representing the 'bookings' table schema
 */
class Booking {
  constructor({
    id,
    turf_id,
    user_id,
    booking_date,
    start_time,
    end_time,
    total_price,
    status,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.turf_id = turf_id;
    this.user_id = user_id;
    this.booking_date = booking_date;
    this.start_time = start_time;
    this.end_time = end_time;
    this.total_price = total_price;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toPublic() {
    return {
      id: this.id,
      turf_id: this.turf_id,
      user_id: this.user_id,
      booking_date: this.booking_date,
      start_time: this.start_time,
      end_time: this.end_time,
      total_price: this.total_price,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Booking;