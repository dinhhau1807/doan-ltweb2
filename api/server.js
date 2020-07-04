/* eslint-disable */
// Declare environment variables
require('dotenv').config({ path: './.env' });

const port = process.env.PORT || process.env.LOCAL_PORT;
const app = require('./app');
var db = require('./models');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect database
db.sequelize
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
