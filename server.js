require('dotenv').config();

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('===== UNHANDLED REJECTION =====');
  console.error('Reason:', reason);
  if (reason instanceof Error) {
    console.error('Error message:', reason.message);
    console.error('Stack trace:', reason.stack);
  }
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});