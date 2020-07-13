const asyncHandler = require('express-async-handler');

const { Customer } = require('../models');
const AppError = require('../utils/appError');
const passwordValidator = require('../utils/passwordValidator');

exports.getInfo = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const customerInfo = await Customer.findOne({
    attributes: {
      exclude: ['password', 'verifyCode'],
    },
    where: { id: customer.id },
  });
  res.status(200).json({ status: 'success', data: customerInfo });
});

exports.updateInfo = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const { name, dateOfBirth, phoneNumber, address } = req.body;
  await Customer.update(
    {
      name,
      dateOfBirth,
      phoneNumber,
      address,
    },
    {
      where: { id: customer.id },
    }
  );
  res.status(200).json({
    status: 'success',
    message: 'Update information successful.',
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const { oldPassword, newPassword } = req.body;
  const matchedOldPwd = await passwordValidator.verifyHashedPassword(
    oldPassword,
    customer.password
  );
  const matchedNewPwd = await passwordValidator.verifyHashedPassword(
    newPassword,
    customer.password
  );
  if (!matchedOldPwd) {
    return next(new AppError('Old password incorrect.', 401));
  }
  if (matchedNewPwd) {
    return next(
      new AppError('New password must be different from current password.', 401)
    );
  }

  const newPasswordHashed = await passwordValidator.createHashedPassword(
    newPassword
  );

  await Customer.update(
    {
      password: newPasswordHashed,
      passwordUpdatedAt: new Date(),
    },
    {
      where: { id: customer.id },
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Change password successful.',
  });
});
