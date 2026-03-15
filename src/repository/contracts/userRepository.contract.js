/**
 * Contract (interface) for the user repository.
 * Concrete implementations must satisfy this shape.
 */
module.exports = {
  createUser: async (data) => {},
  findUserByEmail: async (email) => {},
  findUserById: async (id) => {},
  updateUser: async (id, data) => {},
};
