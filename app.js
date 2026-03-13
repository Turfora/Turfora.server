require('dotenv').config();

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

module.exports = app;
