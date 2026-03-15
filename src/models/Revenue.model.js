    /**
 * Revenue model for tracking turf owner earnings
 */
class Revenue {
  constructor({
    id,
    ownerId,
    turfId,
    bookingId,
    amount,
    transactionDate,
    status = 'completed',
    notes = null,
    createdAt,
    updatedAt,
    deletedAt = null,
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.turfId = turfId;
    this.bookingId = bookingId;
    this.amount = amount;
    this.transactionDate = transactionDate;
    this.status = status;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  toPublic() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      turfId: this.turfId,
      bookingId: this.bookingId,
      amount: this.amount,
      transactionDate: this.transactionDate,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Revenue;