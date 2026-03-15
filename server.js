require('dotenv').config();

// ===== GLOBAL ERROR HANDLING =====
process.on('unhandledRejection', (reason, promise) => {
  console.error('===== UNHANDLED REJECTION =====');
  console.error('Reason:', reason);
  if (reason instanceof Error) {
    console.error('Error message:', reason.message);
    console.error('Stack trace:', reason.stack);
  }
  console.error('Promise:', promise);
  console.error('==============================');
});

process.on('uncaughtException', (error) => {
  console.error('===== UNCAUGHT EXCEPTION =====');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('=============================');
  process.exit(1);
});

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║     🚀 Turfora Server Started      ║
╠════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Time: ${new Date().toISOString()}
╚════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});