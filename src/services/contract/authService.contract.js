/**
 * Contract (interface) for the auth service.
 * Concrete implementations must satisfy this shape.
 */
module.exports = {
  register: async (fullName, email, password, phone) => {},
  login: async (email, password) => {},
  getProfile: async (userId) => {},
};
