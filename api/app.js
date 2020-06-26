const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Start express app
const app = express();
app.enable('trust proxy');

// GLOBAL MIDDLEWARE
app.use(cors());

// Development logging request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World'
  });
});

module.exports = app;
