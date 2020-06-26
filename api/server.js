/* eslint-disable */
// Declare environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Listen app
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Api-server running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
