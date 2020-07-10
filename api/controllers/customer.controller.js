const asyncHandler = require('express-async-handler');

const { Op } = require('sequelize');
const { Customer, Identity } = require('../models');
const AppError = require('../utils/appError');

// test method
exports.getAllCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.findAll();
  res.status(200).json({ status: 'success', data: customers });
});
