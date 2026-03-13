/**
<<<<<<< HEAD
 * User data model schema definition.
 * Represents the structure of a user record in Supabase.
 */
module.exports = {
  tableName: 'users',

  /**
   * Returns a sanitized user object (excludes sensitive fields).
   * @param {Object} user - Raw user object from the database
   * @returns {Object} Safe user object
   */
  toSafeUser(user) {
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Schema reference (for documentation purposes).
   * Actual table is managed in Supabase.
   *
   * CREATE TABLE users (
   *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   *   email TEXT UNIQUE NOT NULL,
   *   password_hash TEXT,
   *   full_name TEXT,
   *   avatar_url TEXT,
   *   is_email_verified BOOLEAN DEFAULT FALSE,
   *   created_at TIMESTAMPTZ DEFAULT NOW(),
   *   updated_at TIMESTAMPTZ DEFAULT NOW()
   * );
   */
  schema: {
    id: 'UUID',
    email: 'TEXT',
    password_hash: 'TEXT',
    full_name: 'TEXT',
    avatar_url: 'TEXT',
    is_email_verified: 'BOOLEAN',
    created_at: 'TIMESTAMPTZ',
    updated_at: 'TIMESTAMPTZ',
  },
};
=======
 * User model representing the 'users' table schema with camelCase column names.
 */
class User {
  constructor({
    id,
    email,
    passwordHash,
    fullName,
    phone,
    isEmailVerified = false,
    emailVerifiedAt = null,
    createdAt,
    updatedAt,
    deletedAt = null,
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.phone = phone;
    this.isEmailVerified = isEmailVerified;
    this.emailVerifiedAt = emailVerifiedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  /** Return a safe public representation (no passwordHash). */
  toPublic() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
      isEmailVerified: this.isEmailVerified,
      emailVerifiedAt: this.emailVerifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;
>>>>>>> deb2861ccc8a451638f9dea248c1f565f4dc3d32
