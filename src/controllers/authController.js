const authService = require('../services/auth.service');

module.exports = {
  async register(req, res) {
    try {
      console.log('Register request body:', req.body);
      
      const { email, password, fullname, phone } = req.body;

      if (!email || !password) {
        console.error('Missing email or password');
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await authService.register(email, password, fullname, phone);
      
      console.log('User registered successfully:', user);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: user,
      });
    } catch (error) {
      console.error('===== REGISTER ERROR =====');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('==========================');
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      console.log('Login request body:', req.body);
      
      const { email, password } = req.body;

      if (!email || !password) {
        console.error('Missing email or password');
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await authService.login(email, password);

      console.log('Login successful for user:', user.email);
      
      res.json({
        message: 'Login successful',
        token,
        user,
      });
    } catch (error) {
      console.error('===== LOGIN ERROR =====');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('======================');
      res.status(401).json({ error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await authService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('===== GET PROFILE ERROR =====');
      console.error('Error:', error.message);
      console.error('=============================');
      res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullname, phone } = req.body;

      const updatedUser = await authService.updateUser(userId, {
        fullname,
        phone,
      });

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('===== UPDATE PROFILE ERROR =====');
      console.error('Error:', error.message);
      console.error('=================================');
      res.status(400).json({ error: error.message });
    }
  },
};