

class Turf {
  constructor({
    id,
    owner_id,
    ownerId,
    name,
    description,
    location,
    category,
    price_per_hour,
    pricePerHour,
    opening_time,
    openingTime,
    closing_time,
    closingTime,
    phone_number,
    phoneNumber,
    amenities = [],
    images = [],
    image_url,
    imageUrl,
    videos = [],
    rating = 4.5,
    is_featured,
    isFeatured = false,
    is_active,
    isActive = true,
    created_at,
    createdAt,
    updated_at,
    updatedAt,
    deleted_at,
    deletedAt = null,
  }) {
    // Handle both camelCase and snake_case from database
    this.id = id;
    this.ownerId = ownerId || owner_id;
    this.name = name;
    this.description = description;
    this.location = location;
    this.category = category;
    this.pricePerHour = pricePerHour || price_per_hour;
    this.openingTime = openingTime || opening_time || '06:00';
    this.closingTime = closingTime || closing_time || '22:00';
    this.phoneNumber = phoneNumber || phone_number;
    this.amenities = Array.isArray(amenities) ? amenities : [];
    this.images = Array.isArray(images) ? images : [];
    this.imageUrl = imageUrl || image_url;
    this.videos = Array.isArray(videos) ? videos : [];
    this.rating = rating || 4.5;
    this.isFeatured = isFeatured || is_featured || false;
    this.isActive = isActive !== false && is_active !== false;
    this.createdAt = createdAt || created_at;
    this.updatedAt = updatedAt || updated_at;
    this.deletedAt = deletedAt || deleted_at;
  }

  /**
   * Convert to public API response format
   * Removes sensitive/internal fields and uses camelCase naming
   */
  toPublic() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      name: this.name,
      description: this.description,
      location: this.location,
      category: this.category,
      pricePerHour: this.pricePerHour,
      price_per_hour: this.pricePerHour,
      openingTime: this.openingTime,
      closingTime: this.closingTime,
      phoneNumber: this.phoneNumber,
      amenities: this.amenities,
      images: this.images,
      imageUrl: this.imageUrl,
      image_url: this.imageUrl,
      videos: this.videos,
      rating: this.rating,
      isFeatured: this.isFeatured,
      isActive: this.isActive, // STATUS: true = active, false = inactive
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Check if turf is currently available for booking
   */
  isAvailable() {
    return this.isActive === true && this.deletedAt === null;
  }

  /**
   * Get turf status as human-readable string
   */
  getStatus() {
    if (this.deletedAt) return 'DELETED';
    if (this.isActive) return 'ACTIVE';
    return 'INACTIVE';
  }
}

module.exports = Turf;