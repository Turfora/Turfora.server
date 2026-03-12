const repo = require('../repository/implementations/userRepository.impl');
module.exports = { registerUser: async (data) => repo.createUser(data) };