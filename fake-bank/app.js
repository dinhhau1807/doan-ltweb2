const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./routes');

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
app.use('/api', router);

// Ignore favicon
app.get('/favicon.ico', (req, res) => res.status(204));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: err.message,
  });
});

module.exports = app;
