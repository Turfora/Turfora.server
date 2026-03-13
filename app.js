require('dotenv').config();
<<<<<<< HEAD
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/auth', require('./src/routes/auth.routes'));
=======

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
// Legacy user routes kept for backwards compatibility
app.use('/api/users', require('./src/routes/user.routes'));

// Centralised error handler (must be last)
app.use(require('./src/utils/errorHandler'));
>>>>>>> deb2861ccc8a451638f9dea248c1f565f4dc3d32

module.exports = app;
