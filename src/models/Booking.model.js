/**
 * Booking model representing the 'bookings' table schema
 */
class Booking {
  constructor({
    id,
    turfId,
    userId,
    ownerId,
    bookingDate,
    startTime,
    endTime,
    amount,
    status = 'pending',
    isActive = true,
    createdAt,
    updatedAt,
    deletedAt = null,
  }) {
    this.id = id;
    this.turfId = turfId;
    this.userId = userId;
    this.ownerId = ownerId;
    this.bookingDate = bookingDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.amount = amount;
    this.status = status;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  toPublic() {
    return {
      id: this.id,
      turfId: this.turfId,
      userId: this.userId,
      ownerId: this.ownerId,
      bookingDate: this.bookingDate,
      startTime: this.startTime,
      endTime: this.endTime,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Booking;