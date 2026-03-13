/**
 * Turf model representing the 'turfs' table schema
 */
class Turf {
  constructor({
    id,
    name,
    category,
    location,
    price_per_hour,
    rating,
    image_url,
    description,
    amenities,
    availability,
    is_featured,
    owner_id,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.location = location;
    this.price_per_hour = price_per_hour;
    this.rating = rating;
    this.image_url = image_url;
    this.description = description;
    this.amenities = amenities;
    this.availability = availability;
    this.is_featured = is_featured;
    this.owner_id = owner_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toPublic() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      location: this.location,
      price_per_hour: this.price_per_hour,
      rating: this.rating,
      image_url: this.image_url,
      description: this.description,
      amenities: this.amenities,
      availability: this.availability,
      is_featured: this.is_featured,
    };
  }
}

module.exports = Turf;