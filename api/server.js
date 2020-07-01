/* eslint-disable */
// Declare environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;
const app = require('./app');
const sequelize = require('./models/db');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect database
sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Listen app
const server = app.listen(port, () => {
  console.log(`Api-server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
