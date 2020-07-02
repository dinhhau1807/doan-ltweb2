const asyncHandler = require('express-async-handler');

const { Customer } = require('../models');

// test method
exports.getAllCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.findAll();
  res.status(200).json({ status: 'success', data: customers });
});
