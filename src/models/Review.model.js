/**
 * Review model representing the 'reviews' table schema
 */
class Review {
  constructor({
    id,
    turf_id,
    user_id,
    rating,
    comment,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.turf_id = turf_id;
    this.user_id = user_id;
    this.rating = rating;
    this.comment = comment;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toPublic() {
    return {
      id: this.id,
      turf_id: this.turf_id,
      user_id: this.user_id,
      rating: this.rating,
      comment: this.comment,
      created_at: this.created_at,
    };
  }
}

module.exports = Review;