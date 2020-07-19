const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Customer, Transaction, Account } = require('../models');
const AppError = require('../utils/appError');
const passwordValidator = require('../utils/passwordValidator');
const { STATUS, TRANS_STATUS } = require('../utils/enums/statusEnum');
const CURRENCY_UNIT = require('../utils/enums/currencyUnitEnum');
const ACCOUNT_TYPE = require('../utils/enums/accountTypeEnum');
const otpGenerator = require('../utils/otpGenerator');
const convert = require('../utils/currencyConverter');
const EmailService = require('../services/emailService');
const OTPService = require('../services/otpService');

exports.getInfo = asyncHandler(async (req, res, next) => {
  const customer = { ...req.user.dataValues };

  delete customer.password;
  delete customer.verifyCode;
  delete customer.accessFailedCount;
  delete customer.passwordUpdatedAt;

  res.status(200).json({ status: 'success', data: customer });
});

exports.updateInfo = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const { name, dateOfBirth, phoneNumber, address } = req.body;

  await Customer.update(
    { name, dateOfBirth, phoneNumber, address },
    { where: { id: customer.id } }
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
    return next(new AppError('Old password incorrect.', 400));
  }
  if (matchedNewPwd) {
    return next(
      new AppError('New password must be different from current password.', 400)
    );
  }

  const newPasswordHashed = await passwordValidator.createHashedPassword(
    newPassword
  );

  await Customer.update(
    { password: newPasswordHashed, passwordUpdatedAt: new Date() },
    { where: { id: customer.id } }
  );

  res.status(200).json({
    status: 'success',
    message: 'Change password successful.',
  });
});

exports.transactionsHistory = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const { fromDate, toDate } = req.query;
  let { page, limit, sortBy, sortType } = req.query;
  const attributes = ['createdAt'];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy))) sortBy = 'createdAt';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query[attr] && !fromDate && !toDate) {
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
    if (fromDate && toDate) {
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
      message: 'Transaction not found in this time.',
    });
  }

  return res.status(200).json({
    status: 'success',
    totalItems: transactions.count,
    items: transactions.rows,
  });
});

exports.internalTransferRequest = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const {
    idAccountSource,
    idAccountDestination,
    amount,
    currencyUnit,
    description,
  } = req.body;

  // Check currency unit & amount
  if (!CURRENCY_UNIT[currencyUnit]) {
    return next(new AppError('Currency unit is not valid!', 400));
  }

  if (Number.isNaN(parseFloat(amount)) || !Number.isFinite(amount)) {
    return next(new AppError('Amount must be a numeric value!', 400));
  }

  // Check account destination
  const accountDestination = await Account.findOne({
    where: {
      [Op.and]: [
        { id: idAccountDestination },
        { customerId: { [Op.ne]: customer.id } },
        { status: { [Op.notIn]: [STATUS.blocked, STATUS.deleted] } },
        { type: ACCOUNT_TYPE.payment },
      ],
    },
  });
  if (!accountDestination) {
    return next(new AppError('Account destination not found or blocked!', 404));
  }

  // Check account source
  const accountSource = await Account.findOne({
    where: {
      [Op.and]: [
        { id: idAccountSource },
        { customerId: customer.id },
        { status: { [Op.notIn]: [STATUS.deleted] } },
        { type: ACCOUNT_TYPE.payment },
      ],
    },
  });
  if (!accountSource) {
    return next(new AppError('Your account not found!', 404));
  }

  if (accountSource.status === STATUS.blocked) {
    return next(
      new AppError(
        'Your account is blocked! Please contact staff to unblock.',
        403
      )
    );
  }

  // Check account source have enough money to make transaction
  let amountConverted = null;
  try {
    amountConverted = convert(amount)
      .from(currencyUnit)
      .to(accountSource.currentUnit);
  } catch (err) {
    return next(err);
  }

  if (accountSource.currentBalance < amountConverted) {
    return next(
      new AppError(
        'Your account does not have enough money to make this transaction!'
      )
    );
  }

  // Create new transaction
  const otpCode = otpGenerator();
  const otpCreatedDate = new Date();
  const otpExpiredDate = new Date(otpCreatedDate.getTime() + 10 * 60000);

  await Transaction.create({
    accountSourceId: accountSource.id,
    accountDestination: accountDestination.id,
    amount,
    currencyUnit,
    description: description || '',
    otpCode,
    otpCreatedDate,
    otpExpiredDate,
  });

  // Send otp code to user
  const email = new EmailService(req.user);
  await email.sendOTPCode(otpCode);

  //For production
  // const otp = new OTPService(req.user);
  // await otp.sendOTPCode(otpCode);

  return res.status(200).json({
    status: 'success',
    message: 'OTP code was sent your email!',
  });
});

exports.internalTransferConfirm = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const { otpCode } = req.body;

  if (!otpCode) {
    return next(new AppError('OTP code cannot be empty!'), 400);
  }

  // Get account ids
  let accounts = await Account.findAll({
    attributes: ['id'],
    where: {
      customerId: customer.id,
    },
  });
  accounts = accounts.map((account) => account.id);

  const transaction = await Transaction.findOne({
    where: {
      accountSourceId: { [Op.in]: accounts },
      otpCode: `${otpCode}`,
      status: TRANS_STATUS.pending,
    },
  });

  if (!transaction) {
    return next(new AppError('Transaction not found!'), 404);
  }

  // Check if OTP was expired
  if (transaction.otpExpiredDate < new Date()) {
    transaction.status = TRANS_STATUS.failed;
    transaction.save();
    return next(new AppError('OTP was expired!'), 403);
  }

  // Get account destination
  const accountDestination = await Account.findOne({
    where: {
      id: transaction.accountDestination,
      status: { [Op.notIn]: [STATUS.blocked, STATUS.deleted] },
    },
  });
  if (!accountDestination) {
    return next(new AppError('Account destination not found or blocked!', 404));
  }

  // Get account source
  const accountSource = await Account.findOne({
    where: {
      id: transaction.accountSourceId,
      status: { [Op.notIn]: [STATUS.deleted, STATUS.blocked] },
    },
  });
  if (!accountSource) {
    return next(new AppError('Your account not found or blocked!', 404));
  }

  // Calculation and update database
  accountSource.currentBalance -= convert(transaction.amount)
    .from(transaction.currencyUnit)
    .to(accountSource.currentUnit);

  accountDestination.currentBalance =
    +accountDestination.currentBalance +
    convert(transaction.amount)
      .from(transaction.currencyUnit)
      .to(accountDestination.currentUnit);

  transaction.status = TRANS_STATUS.succeed;

  accountSource.save();
  accountDestination.save();
  transaction.save();

  return res.status(200).json({
    status: 'success',
    message: 'Your transaction is succeed!',
  });
});
