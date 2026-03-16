/**
 * User model representing the 'users' table schema with camelCase column names.
 */
class User {
  constructor({
    id,
    email,
    passwordHash,
    fullName,
    phone,
    role = 'USER', // ✅ ADD DEFAULT ROLE
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
    this.role = role; // ✅ STORE ROLE
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
      role: this.role, // ✅ INCLUDE ROLE
      isEmailVerified: this.isEmailVerified,
      emailVerifiedAt: this.emailVerifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;