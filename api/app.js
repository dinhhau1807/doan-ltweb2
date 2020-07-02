const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');

// Router import
const customerRouter = require('./routes/customer.routes');

// Start express app
const app = express();
app.enable('trust proxy');

// Implement cors
app.use(cors());

// Parse data from incoming request
app.use(express.json());

// Development logging request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ROUTES
// ? for testing
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello the world!',
  });
});
app.use('/api/customers', customerRouter);

// Route not found
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;

// Uncomment for init database purpose
// const Customer = require('./models/customer.model');
