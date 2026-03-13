const authService = require('../services/implementations/authService.impl');

const register = async (req, res, next) => {
  try {
    console.log('[authController] Register endpoint hit');
    console.log('[authController] Request body:', req.body);
    
    const { fullName, email, password, phone } = req.body;
    const result = await authService.register(fullName, email, password, phone);
    
    console.log('[authController] Register successful');
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('[authController] Register error caught:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack
    });
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    console.log('[authController] Login endpoint hit');
    console.log('[authController] Request body:', req.body);
    
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    console.log('[authController] Login successful');
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('[authController] Login error caught:', err.message);
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    console.log('[authController] getProfile endpoint hit');
    const user = await authService.getProfile(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('[authController] getProfile error caught:', err.message);
    next(err);
  }
};

module.exports = { register, login, getProfile };