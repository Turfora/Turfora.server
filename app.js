require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const turfRoutes = require('./src/routes/turfRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const revenueRoutes = require('./src/routes/revenueRoutes');
const ownerRoutes = require('./src/routes/ownerRoutes');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/owner', ownerRoutes);

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('[ERROR HANDLER]', {
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error',
  };

  // Add stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

module.exports = app;