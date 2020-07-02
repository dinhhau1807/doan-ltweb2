const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Customer } = require('../models');
const AppError = require('../utils/appError');
// const passwordValidator = require('../utils/passwordValidator');

const signToken = (type, id) => {
  return jwt.sign({ type, id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.customerLogin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email and password exist
  if (!username || !password) {
    return next(
      new AppError('Please provide username/email and password!', 400)
    );
  }

  // Check if customer exists && password is correct
  const customer = await Customer.findOne({
    where: { [Op.or]: [{ username }, { email: username }] },
  });

  //? temp check password, willing to use hash in future
  // if (!customer || !(await passwordValidator.verifyHashedPassword(password, customer.password))) {
  if (!customer || customer.password !== '1234demo') {
    return next(new AppError('Incorrect username/email or password', 401));
  }

  // Create login token and send to client
  const token = signToken('customer', customer.id);

  return res
    .status(200)
    .json({ status: 'success', data: { status: 'success', token } });
});
