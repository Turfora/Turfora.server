const supabase = require('../../config/db.config');

const TABLE = 'reviews';

const createReview = async (data) => {
  try {
    console.log('[reviewRepository] Creating review:', data);

    const { data: review, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return review;
  } catch (error) {
    console.error('[reviewRepository] createReview error:', error);
    throw error;
  }
};

const getReviewsByTurfId = async (turfId) => {
  try {
    const { data: reviews, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('turf_id', turfId);

    if (error) throw error;
    return reviews || [];
  } catch (error) {
    console.error('[reviewRepository] getReviewsByTurfId error:', error);
    throw error;
  }
};

module.exports = { createReview, getReviewsByTurfId };