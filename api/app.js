const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const GlobalAppError = require('./controllers/error.controller');

// Router import
const customerRouter = require('./routes/customer.routes');
const staffRouter = require('./routes/staff.routes');
const adminRouter = require('./routes/admin.routes');

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
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello the world 😄😄😄!',
  });
});
app.use('/api/customers', customerRouter);
app.use('/api/staff', staffRouter);
app.use('/api/admin', adminRouter);

// Ignore favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Route not found
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handle global error
app.use(GlobalAppError);

module.exports = app;
