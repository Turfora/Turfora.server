/**
 * User model representing the 'users' table schema with lowercase column names.
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