const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const axios = require('axios');

const { Customer, Transaction, Account, DepositTerm } = require('../models');
const AppError = require('../utils/appError');
const passwordValidator = require('../utils/passwordValidator');
const { STATUS, TRANS_STATUS } = require('../utils/enums/statusEnum');
const ACCOUNT_TYPE = require('../utils/enums/accountTypeEnum');
const otpGenerator = require('../utils/otpGenerator');
const convert = require('../utils/currencyConverter');
const EmailService = require('../services/emailService');
const SmsService = require('../services/smsService');

const fixBalance = (balance) => {
  return new Intl.NumberFormat().format(balance);
};

const fixDate = (date) => {
  return new Date(date).toLocaleString();
};

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

  const account = await Account.findOne({
    where: {
      customerId: customer.id,
      type: ACCOUNT_TYPE.payment,
    },
  });

  if (!account) {
    return next(new AppError('You did not have any account.', 400));
  }

  const transactions = await Transaction.findAndCountAll({
    attributes: {
      exclude: ['otpCode', 'otpCreatedDate', 'otpExpiredDate'],
    },
    where: {
      [Op.and]: [
        {
          [Op.or]: {
            accountSourceId: account.id,
            accountDestination: account.id,
          },
        },
        ...filterArr,
      ],
    },
    order: [[sortBy, sortType]],
    offset: (page - 1) * limit,
    limit,
  });

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
    description,
  } = req.body;

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

  if (accountSource.currentBalance < amount) {
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
    currencyUnit: accountSource.currentUnit,
    description: description || '',
    otpCode,
    otpCreatedDate,
    otpExpiredDate,
  });

  // Send otp code to user
  const email = new EmailService(req.user);
  await email.sendOTPCode(otpCode);

  // Send otp code to user with SMS
  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.sendOTPCode(otpCode);
  }

  return res.status(200).json({
    status: 'success',
    message: 'OTP code was sent to your email/phone!',
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
    await transaction.save();
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

  const getUserSource = await Customer.findOne({
    where: {
      id: accountSource.customerId,
    },
  });

  const getUserDestination = await Customer.findOne({
    where: {
      id: accountDestination.customerId,
    },
  });

  if (!getUserSource) {
    return next(new AppError('Your account not found or blocked!', 404));
  }

  if (!getUserDestination) {
    return next(new AppError('Your account not found or blocked!', 404));
  }

  const amountOut = ['-', fixBalance(transaction.amount)].join('');
  const amountIn = ['+', fixBalance(transaction.amount)].join('');

  // Send otp code to user
  const email = new EmailService(req.user);

  // Calculation and update database
  accountSource.currentBalance -= convert(transaction.amount)
    .from(transaction.currencyUnit)
    .to(accountSource.currentUnit);

  await email.balanceChangesInternal(
    getUserSource.name,
    accountSource.id,
    getUserDestination.name,
    accountDestination.id,
    transaction.id,
    amountOut,
    fixDate(transaction.createdAt),
    fixBalance(accountSource.currentBalance),
    transaction.description,
    getUserSource.email
  );

  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.balanceChangesInternal(
      getUserSource.name,
      accountSource.id,
      getUserDestination.name,
      accountDestination.id,
      transaction.id,
      amountOut,
      fixDate(transaction.createdAt),
      fixBalance(accountSource.currentBalance),
      transaction.description,
      getUserSource.phoneNumber
    );
  }

  accountDestination.currentBalance =
    +accountDestination.currentBalance +
    convert(transaction.amount)
      .from(transaction.currencyUnit)
      .to(accountDestination.currentUnit);

  await email.balanceChangesInternal(
    getUserSource.name,
    accountSource.id,
    getUserDestination.name,
    accountDestination.id,
    transaction.id,
    amountIn,
    fixDate(transaction.createdAt),
    fixBalance(accountDestination.currentBalance),
    transaction.description,
    getUserDestination.email
  );

  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.balanceChangesInternal(
      getUserSource.name,
      accountSource.id,
      getUserDestination.name,
      accountDestination.id,
      transaction.id,
      amountIn,
      fixDate(transaction.createdAt),
      fixBalance(accountDestination.currentBalance),
      transaction.description,
      getUserDestination.phoneNumber
    );
  }

  transaction.status = TRANS_STATUS.succeed;

  await accountSource.save();
  await accountDestination.save();
  await transaction.save();

  return res.status(200).json({
    status: 'success',
    message: 'Your transaction is succeed!',
  });
});

exports.getBanks = asyncHandler(async (req, res, next) => {
  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.BANK_KEY}` },
  };

  let banks = [];
  try {
    const result = await axios.get(
      `${process.env.BANK_DOMAIN}/api/banks`,
      options
    );

    if (result.data.status !== 'success') {
      return next(new AppError(result.data.message, 500));
    }

    ({ banks } = result.data);
  } catch (err) {
    return next(new AppError(err.message, 500));
  }

  return res.status(200).json({
    status: 'success',
    data: banks,
  });
});

exports.externalTransferRequest = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const {
    idAccountSource,
    idAccountDestination,
    idBankDestination,
    amount,
    description,
  } = req.body;

  if (Number.isNaN(parseFloat(amount)) || !Number.isFinite(amount)) {
    return next(new AppError('Amount must be a numeric value!', 400));
  }

  if (!idBankDestination) {
    return next(new AppError('ID bank destination not valid!', 400));
  }
  if (!idAccountDestination) {
    return next(new AppError('ID account destination not valid!', 400));
  }

  // Get banks from API center
  let banks = [];

  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.BANK_KEY}` },
  };

  try {
    const result = await axios.get(
      `${process.env.BANK_DOMAIN}/api/banks`,
      options
    );

    if (result.data.status !== 'success') {
      return next(new AppError(result.data.message, 500));
    }

    ({ banks } = result.data);
  } catch (err) {
    return next(new AppError(err.message, 500));
  }

  if (!banks.map((b) => b.id).includes(idBankDestination)) {
    return next(new AppError('Bank is not valid!', 400));
  }

  const bank = banks.find((b) => b.id === idBankDestination);

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

  if (accountSource.currentBalance < amount) {
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
    accountDestination: idAccountSource,
    bankDestinationId: idBankDestination,
    bankDestinationName: bank.name,
    amount,
    currencyUnit: accountSource.currentUnit,
    description: description || '',
    otpCode,
    otpCreatedDate,
    otpExpiredDate,
  });

  // Send otp code to user
  const email = new EmailService(req.user);
  await email.sendOTPCode(otpCode);

  // Send otp code to user with SMS
  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.sendOTPCode(otpCode);
  }

  return res.status(200).json({
    status: 'success',
    message: 'OTP code was sent to your email/phone!',
  });
});

exports.externalTransferConfirm = asyncHandler(async (req, res, next) => {
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
    await transaction.save();
    return next(new AppError('OTP was expired!'), 403);
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

  // Prepare for transfer
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.BANK_KEY}` },
  };

  const body = {
    amount: transaction.amount,
    currency: transaction.currencyUnit,
    destinationBankId: transaction.bankDestinationId,
    destinationAccount: transaction.accountDestination,
    note: transaction.description,
  };

  try {
    const transferResult = await axios.post(
      `${process.env.BANK_DOMAIN}/api/transfers`,
      body,
      options
    );

    if (transferResult.data.status !== 'success') {
      return next(new AppError(transferResult.data.message, 500));
    }
  } catch (err) {
    return next(new AppError(err.message, 500));
  }

  const getUserSource = await Customer.findOne({
    where: {
      id: accountSource.customerId,
    },
  });

  if (!getUserSource) {
    return next(new AppError('Your account not found or blocked!', 404));
  }

  const amountOut = ['-', fixBalance(transaction.amount)].join('');

  // Send otp code to user
  const email = new EmailService(req.user);

  // Calculation and update database
  accountSource.currentBalance -= convert(transaction.amount)
    .from(transaction.currencyUnit)
    .to(accountSource.currentUnit);

  await email.balanceChangesExternal(
    transaction.id,
    accountSource.id,
    amountOut,
    fixDate(transaction.createdAt),
    transaction.description,
    transaction.accountDestination,
    transaction.bankDestinationName,
    fixBalance(accountSource.currentBalance),
    getUserSource.email
  );

  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.balanceChangesExternal(
      transaction.id,
      accountSource.id,
      amountOut,
      fixDate(transaction.createdAt),
      transaction.description,
      transaction.accountDestination,
      transaction.bankDestinationName,
      fixBalance(accountSource.currentBalance),
      getUserSource.phoneNumber
    );
  }

  transaction.status = TRANS_STATUS.succeed;

  await accountSource.save();
  await transaction.save();

  return res.status(200).json({
    status: 'success',
    message: 'Your transaction is succeed!',
  });
});

exports.getDepositTerms = asyncHandler(async (req, res, next) => {
  const depositTerms = await DepositTerm.findAll();

  return res.status(200).json({
    status: 'success',
    data: depositTerms,
  });
});

exports.depositRegisterRequest = asyncHandler(async (req, res, next) => {
  const MIN_AMOUNT_VND = 3000000;
  const customerInfo = req.user;
  const { amount, term } = req.body;

  // Create new transaction
  const otpCode = otpGenerator();
  const otpCreatedDate = new Date();
  const otpExpiredDate = new Date(otpCreatedDate.getTime() + 10 * 60000);

  const getInterestRate = await DepositTerm.findOne({
    where: {
      period: term,
    },
  });

  if (!getInterestRate) {
    return next(new AppError('Term is invalid!', 400));
  }

  if (Number.isNaN(parseFloat(amount)) || !Number.isFinite(amount)) {
    return next(new AppError('Amount must be a numeric value!', 400));
  }

  // Check account source
  const customerPayment = await Account.findOne({
    where: {
      [Op.and]: [
        { customerId: customerInfo.id },
        { status: { [Op.notIn]: [STATUS.deleted] } },
        { type: ACCOUNT_TYPE.payment },
      ],
    },
  });

  if (customerPayment.status === STATUS.blocked) {
    return next(
      new AppError(
        'Your account is blocked! Please contact staff to unblock.',
        403
      )
    );
  }

  const MIN_AMOUNT_USD = convert(MIN_AMOUNT_VND).from('VND').to('USD');

  if (customerPayment.currentBalance < amount) {
    return next(new AppError('Your account does not have enough money!'));
  }

  if (
    (amount < MIN_AMOUNT_VND && customerPayment.currentUnit === 'VND') ||
    (amount < MIN_AMOUNT_USD && customerPayment.currentUnit === 'USD')
  ) {
    return next(
      new AppError(
        'Minimum amount to register savings account is ' +
          `${MIN_AMOUNT_VND}` +
          ' VND or $' +
          `${MIN_AMOUNT_USD}`
      )
    );
  }

  const customerDeposit = await Account.findOne({
    where: {
      [Op.and]: [
        { customerId: customerInfo.id },
        { status: STATUS.inactive },
        { type: ACCOUNT_TYPE.saving },
      ],
    },
  });

  if (customerDeposit) {
    customerDeposit.currentBalance = amount;
    customerDeposit.term = term;
    customerDeposit.currentUnit = customerPayment.currentUnit;
    customerDeposit.interestRate = getInterestRate.interestRate;
    await customerDeposit.save();

    const transaction = await Transaction.findOne({
      where: {
        accountSourceId: customerPayment.id,
        accountDestination: customerDeposit.id,
        status: TRANS_STATUS.pending,
      },
    });
    if (transaction) {
      transaction.amount = amount;
      transaction.otpCode = otpCode;
      transaction.otpCreatedDate = otpCreatedDate;
      transaction.otpExpiredDate = otpExpiredDate;
      await transaction.save();
    }
  }

  if (!customerDeposit) {
    const customerSavings = await Account.create({
      customerId: customerInfo.id,
      type: ACCOUNT_TYPE.saving,
      currentBalance: amount,
      currentUnit: customerPayment.currentUnit,
      status: STATUS.inactive,
      term,
      interestRate: getInterestRate.interestRate,
    });

    await Transaction.create({
      accountSourceId: customerPayment.id,
      accountDestination: customerSavings.id,
      amount,
      currencyUnit: customerPayment.currentUnit,
      description: 'Deposit money into savings account',
      otpCode,
      otpCreatedDate,
      otpExpiredDate,
    });
  }

  // Send otp code to user
  const email = new EmailService(req.user);
  await email.sendOTPCode(otpCode);

  // Send otp code to user with SMS
  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.sendOTPCode(otpCode);
  }

  return res.status(200).json({
    status: 'success',
    message: 'OTP code was sent to your email/phone!',
  });
});

exports.depositRegisterConfirm = asyncHandler(async (req, res, next) => {
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
    await transaction.save();
    return next(new AppError('OTP was expired!'), 403);
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

  // Get account destination
  const accountDestination = await Account.findOne({
    where: {
      [Op.and]: [
        { id: transaction.accountDestination },
        { status: STATUS.inactive },
        { type: ACCOUNT_TYPE.saving },
        { currentBalance: transaction.amount },
      ],
    },
  });
  if (!accountDestination) {
    return next(new AppError('Account destination not found or blocked!', 404));
  }

  const getUserSource = await Customer.findOne({
    where: {
      id: accountSource.customerId,
    },
  });

  if (!getUserSource) {
    return next(new AppError('Your account not found or blocked!', 404));
  }

  const amountOut = ['-', fixBalance(transaction.amount)].join('');

  // Send otp code to user
  const email = new EmailService(req.user);

  // Calculation and update database
  accountSource.currentBalance -= convert(transaction.amount)
    .from(transaction.currencyUnit)
    .to(accountSource.currentUnit);

  await email.balanceChangesDeposit(
    accountSource.id,
    transaction.id,
    amountOut,
    fixDate(transaction.createdAt),
    fixBalance(accountSource.currentBalance),
    transaction.description,
    getUserSource.email
  );

  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.balanceChangesDeposit(
      accountSource.id,
      transaction.id,
      amountOut,
      fixDate(transaction.createdAt),
      fixBalance(accountSource.currentBalance),
      transaction.description,
      getUserSource.phoneNumber
    );
  }

  accountDestination.status = STATUS.active;
  transaction.status = TRANS_STATUS.succeed;

  await accountSource.save();
  await accountDestination.save();
  await transaction.save();

  return res.status(200).json({
    status: 'success',
    message: 'Your transaction is succeed!',
  });
});

exports.getAllDeposit = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  let { page, limit, sortBy, sortType } = req.query;
  const attributes = ['term', 'interestRate', 'createdAt'];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy))) sortBy = 'createdAt';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query.createdAt) {
      const obj = {};
      obj.createdAt = {
        [Op.and]: [
          {
            [Op.gte]: new Date(`${req.query.createdAt}%`),
          },
          {
            [Op.lte]: new Date(`${req.query.createdAt}%`).setDate(
              new Date(`${req.query.createdAt}%`).getDate() + 1
            ),
          },
        ],
      };
      filterArr.push(obj);
    }

    if (req.query[attr]) {
      const obj = {};
      obj[attr] = { [Op.eq]: `${req.query[attr]}` };
      filterArr.push(obj);
    }
  });

  const deposit = await Account.findAndCountAll({
    where: {
      [Op.and]: [
        {
          [Op.and]: {
            customerId: customer.id,
            type: ACCOUNT_TYPE.saving,
            status: STATUS.active,
          },
        },
        ...filterArr,
      ],
    },
    order: [[sortBy, sortType]],
    offset: (page - 1) * limit,
    limit,
  });

  return res.status(200).json({
    status: 'success',
    totalItems: deposit.count,
    items: deposit.rows,
  });
});

exports.getDeposit = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const customer = req.user;
  const account = await Account.findOne({
    where: {
      id,
      customerId: customer.id,
      type: ACCOUNT_TYPE.saving,
    },
  });

  if (!account) {
    return next(new AppError('Account not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: account,
  });
});

exports.depositHistory = asyncHandler(async (req, res, next) => {
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

  // Get account source
  let accountSource = await Account.findAll({
    where: {
      [Op.and]: [{ customerId: customer.id }, { type: ACCOUNT_TYPE.saving }],
    },
  });

  accountSource = accountSource.map((account) => account.id);

  if (!accountSource) {
    return next(new AppError('Your account not found!', 404));
  }

  // Get account Destination
  let accountDestination = await Account.findAll({
    where: {
      status: { [Op.notIn]: [STATUS.deleted, STATUS.blocked] },
      customerId: customer.id,
      type: ACCOUNT_TYPE.payment,
    },
  });
  accountDestination = accountDestination.map((account) => account.id);

  if (!accountDestination) {
    return next(new AppError('Account destination not found or blocked!', 404));
  }

  const transactions = await Transaction.findAndCountAll({
    attributes: {
      exclude: ['otpCode', 'otpCreatedDate', 'otpExpiredDate'],
    },
    where: {
      [Op.and]: [
        {
          [Op.and]: {
            accountSourceId: { [Op.in]: accountSource },
            accountDestination: { [Op.in]: accountDestination },
          },
        },
        ...filterArr,
      ],
    },
    order: [[sortBy, sortType]],
    offset: (page - 1) * limit,
    limit,
  });

  return res.status(200).json({
    status: 'success',
    totalItems: transactions.count,
    items: transactions.rows,
  });
});

exports.getPaymentAccount = asyncHandler(async (req, res, next) => {
  const customer = req.user;

  const paymentAccount = await Account.findOne({
    where: {
      [Op.and]: [{ customerId: customer.id }, { type: ACCOUNT_TYPE.payment }],
    },
  });

  if (
    paymentAccount.status === STATUS.blocked &&
    paymentAccount.status === STATUS.inactive
  ) {
    return next(
      new AppError('Your payment account is inactive or blocked!', 403)
    );
  }

  if (paymentAccount.status === STATUS.deleted) {
    return next(new AppError('Your payment account is deleted!', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: paymentAccount,
  });
});

exports.withdrawalOfDepositRequest = asyncHandler(async (req, res, next) => {
  const customer = req.user;
  const { idSavingAccount } = req.body;

  // Get payment account
  const paymentAccount = await Account.findOne({
    where: {
      [Op.and]: [{ customerId: customer.id }, { type: ACCOUNT_TYPE.payment }],
    },
  });

  if (
    paymentAccount.status === STATUS.blocked ||
    paymentAccount.status === STATUS.inactive
  ) {
    return next(
      new AppError('Your payment account is inactive or blocked!', 403)
    );
  }

  if (paymentAccount.status === STATUS.deleted) {
    return next(new AppError('Your payment account is deleted!', 404));
  }

  // Get saving account
  const savingAccount = await Account.findOne({
    where: {
      [Op.and]: [
        { id: idSavingAccount },
        { customerId: customer.id },
        { type: ACCOUNT_TYPE.saving },
      ],
    },
  });

  if (!savingAccount) {
    return next(new AppError('Not found your saving account!', 404));
  }

  if (
    savingAccount.status === STATUS.blocked ||
    savingAccount.status === STATUS.inactive
  ) {
    return next(
      new AppError('Your saving account is inactive or blocked!', 403)
    );
  }

  if (savingAccount.status === STATUS.deleted) {
    return next(new AppError('Your saving account is deleted!', 404));
  }

  // Calculation (1 month = 30 days)
  let interest = +savingAccount.currentBalance;
  const { term } = savingAccount;
  const createdDate = new Date(savingAccount.createdAt);
  const today = new Date();
  const diffDays = Math.floor(
    Math.abs(today - createdDate) / (1000 * 60 * 60 * 24)
  );
  const diffMonths = Math.floor(diffDays / 30);

  let { interestRate } = savingAccount;
  if (diffDays < 14) {
    interestRate = 0;
    interest += interest * 0;
  } else if (diffMonths < term) {
    interestRate = 1.5;
    interest += interest * (1.5 / 100) * (diffDays / 360);
  }

  const timesTermRepeat = Math.floor(diffMonths / term);
  const remainingDays = diffDays - timesTermRepeat * term * 30;
  if (timesTermRepeat > 0) {
    for (let i = 0; i < timesTermRepeat; i += 1) {
      interest += interest * (interestRate / 100) * ((term * 30) / 360);
    }
    if (remainingDays >= 14) {
      interest += interest * (1.5 / 100) * (remainingDays / 360);
    }
  }

  interest = Math.round(interest);

  // Create new transaction
  const otpCode = otpGenerator();
  const otpCreatedDate = new Date();
  const otpExpiredDate = new Date(otpCreatedDate.getTime() + 10 * 60000);

  await Transaction.create({
    accountSourceId: savingAccount.id,
    accountDestination: paymentAccount.id,
    amount: interest,
    currencyUnit: paymentAccount.currentUnit,
    description: 'Withdrawal of deposit to payment account!',
    otpCode,
    otpCreatedDate,
    otpExpiredDate,
  });

  // Send otp code to user
  const email = new EmailService(req.user);
  await email.sendOTPCode(otpCode);

  // Send otp code to user with SMS
  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.sendOTPCode(otpCode);
  }

  return res.status(200).json({
    status: 'success',
    message:
      'Transaction withdrawal of deposit successfully, please verify OTP.',
  });
});

exports.withdrawalOfDepositConfirm = asyncHandler(async (req, res, next) => {
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
    await transaction.save();
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

  const getUserDestination = await Customer.findOne({
    where: {
      id: accountDestination.customerId,
    },
  });

  if (!getUserDestination) {
    return next(new AppError('Your account not found or blocked!', 404));
  }

  const amountIn = ['+', fixBalance(transaction.amount)].join('');

  // Send otp code to user
  const email = new EmailService(req.user);

  // Calculation and update database
  accountDestination.currentBalance =
    +accountDestination.currentBalance +
    convert(transaction.amount)
      .from(transaction.currencyUnit)
      .to(accountDestination.currentUnit);

  await email.balanceChangesDeposit(
    accountDestination.id,
    transaction.id,
    amountIn,
    fixDate(transaction.createdAt),
    fixBalance(accountDestination.currentBalance),
    transaction.description,
    getUserDestination.email
  );

  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(req.user);
    await sms.balanceChangesDeposit(
      accountDestination.id,
      transaction.id,
      amountIn,
      fixDate(transaction.createdAt),
      fixBalance(accountDestination.currentBalance),
      transaction.description,
      getUserDestination.phoneNumber
    );
  }

  transaction.status = TRANS_STATUS.succeed;
  accountSource.status = STATUS.blocked;

  await accountSource.save();
  await accountDestination.save();
  await transaction.save();

  return res.status(200).json({
    status: 'success',
    message: 'Your transaction is succeed!',
  });
});
