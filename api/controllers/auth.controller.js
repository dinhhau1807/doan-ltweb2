const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/appError');
const Customer = require('../models/customer.model');
const passwordValidator = require('../utils/passwordValidator');

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

  if (
    !customer ||
    !(await passwordValidator.verifyHashedPassword(password, customer.password))
  ) {
    return next(new AppError('Incorrect username/email or password', 401));
  }

  // Create login token and send to client
  const token = signToken('customer', customer.id);

  const customerFound = { ...customer.dataValues };
  delete customerFound.password;
  delete customerFound.verifyCode;

  return res.status(200).json({
    status: 'success',
    data: { status: 'success', token, user: customerFound },
  });
});

exports.customerRegister = asyncHandler(async (req, res, next) => {
  const customer = await Customer.create({
    username: req.body.username,
    email: req.body.email,
    password: await passwordValidator.createHashedPassword(req.body.password),
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    verifyCode: uuidv4(),
  });

  // Create login token and send to client
  const token = signToken('customer', customer.id);

  const newCustomer = { ...customer.dataValues };
  delete newCustomer.password;
  delete newCustomer.verifyCode;

  return res.status(201).json({
    status: 'success',
    data: { status: 'success', token, user: newCustomer },
  });
});
