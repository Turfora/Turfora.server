const service = require('../services/user.service');
exports.register = async (req, res) => { const result = await service.registerUser(req.body); res.json(result); };