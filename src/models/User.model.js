/**
 * User model representing the 'users' table schema.
 */
class User {
  constructor({
    id,
    email,
    passwordhash,
    fullname,
    phone,
    role,
    aud,
    instance_id,
  }) {
    this.id = id;
    this.email = email;
    this.passwordhash = passwordhash;
    this.fullname = fullname;
    this.phone = phone;
    this.role = role;
    this.aud = aud;
    this.instance_id = instance_id;
  }

  /** Return a safe public representation (no passwordhash). */
  toPublic() {
    return {
      id: this.id,
      email: this.email,
      fullname: this.fullname,
      phone: this.phone,
      role: this.role,
    };
  }
}

module.exports = User;