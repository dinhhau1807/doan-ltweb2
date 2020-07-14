const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Customer, Transaction } = require('../models');
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

exports.transactionsHistory = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  // eslint-disable-next-line prefer-const
  let { page, limit, sortBy, sortType, fromDate, toDate } = req.query;
  const attributes = ['createdAt'];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy))) sortBy = 'createdAt';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query[attr] && !req.query.fromDate && !req.query.toDate) {
      const obj = {};
      obj[attr] = {
        [Op.and]: [
          {
            [Op.gte]: new Date(`${req.query[attr]}%`),
          },
          {
            [Op.lte]: new Date(`${req.query[attr]}%`).setDate(
              new Date(`${req.query[attr]}%`).getDate() + 1
            ),
          },
        ],
      };
      filterArr.push(obj);
    }
    if (req.query.fromDate && req.query.toDate) {
      const obj = {};
      obj.createdAt = {
        [Op.between]: [
          new Date(`${fromDate}%`),
          new Date(`${toDate}%`).setDate(new Date(`${toDate}%`).getDate() + 1),
        ],
      };
      filterArr.push(obj);
    }
  });

  const transactions = await Transaction.findAndCountAll({
    attributes: {
      exclude: ['otpCode', 'otpCreatedDate', 'otpExpiredDate'],
    },
    where: {
      [Op.and]: [
        {
          [Op.or]: {
            accountSourceId: customer.id,
            accountDestination: customer.id,
          },
        },
        ...filterArr,
      ],
    },
    order: [[sortBy, sortType]],
    offset: (page - 1) * limit,
    limit,
  });

  if (transactions.count === 0) {
    return res.status(404).json({
      status: 'error',
      msg: 'Transaction not found in this time.',
    });
  }

  return res.status(200).json({
    status: 'success',
    totalItems: transactions.count,
    items: transactions.rows,
  });
});
