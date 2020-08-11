const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const AppError = require('../utils/appError');
const passwordValidator = require('../utils/passwordValidator');
const { STATUS, TRANS_STATUS } = require('../utils/enums/statusEnum');
const ACCOUNT_TYPE = require('../utils/enums/accountTypeEnum');
const CURRENCY_UNIT = require('../utils/enums/currencyUnitEnum');
const ROLE = require('../utils/enums/roleEnum');
const {
  Staff,
  Customer,
  Identity,
  Account,
  Transaction,
} = require('../models');

const findCustomer = asyncHandler(async (id) => {
  const customer = await Customer.findOne({
    attributes: {
      exclude: [
        'password',
        'verifyCode',
        'accessFailedCount',
        'passwordUpdatedAt',
      ],
    },
    where: {
      [Op.and]: [
        { id },
        {
          status: {
            [Op.ne]: STATUS.deleted,
          },
        },
      ],
    },
  });
  return customer;
});

// PERSONAL INFO MANAGEMENT -----------------------------------------------------
exports.getInfo = asyncHandler(async (req, res, next) => {
  const staff = { ...req.user.dataValues };

  delete staff.password;
  delete staff.roleId;
  delete staff.Role;
  delete staff.passwordUpdatedAt;

  res.status(200).json({ status: 'success', data: staff });
});

exports.updateInfo = asyncHandler(async (req, res, next) => {
  const staff = req.user;
  const { name } = req.body;

  await Staff.update({ name }, { where: { id: staff.id } });

  res.status(200).json({
    status: 'success',
    message: 'Update information successful.',
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const staff = req.user;
  const { oldPassword, newPassword } = req.body;
  const matchedOldPwd = await passwordValidator.verifyHashedPassword(
    oldPassword,
    staff.password
  );
  const matchedNewPwd = await passwordValidator.verifyHashedPassword(
    newPassword,
    staff.password
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

  await Staff.update(
    { password: newPasswordHashed, passwordUpdatedAt: new Date() },
    { where: { id: staff.id } }
  );

  res.status(200).json({
    status: 'success',
    message: 'Change password successful.',
  });
});

// CUSTOMER MANAGEMENT -----------------------------------------------------
exports.getAllCustomers = asyncHandler(async (req, res, next) => {
  let { page, limit, sortBy, sortType } = req.query;
  const attributes = ['username', 'email', 'name', 'phoneNumber', 'address'];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy))) sortBy = 'username';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query[attr]) {
      const obj = {};
      obj[attr] = { [Op.like]: `%${req.query[attr]}%` };
      filterArr.push(obj);
    }
  });

  const customers = await Customer.findAndCountAll({
    attributes: {
      exclude: [
        'password',
        'verifyCode',
        'accessFailedCount',
        'passwordUpdatedAt',
      ],
    },
    where: {
      [Op.and]: [
        {
          status: {
            [Op.ne]: STATUS.deleted,
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
    totalItems: customers.count,
    items: customers.rows,
  });
});

exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await findCustomer(req.params.id);

  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: customer,
  });
});

exports.getCustomerIdentity = asyncHandler(async (req, res, next) => {
  const identity = await Identity.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!identity) {
    return next(new AppError('Identity not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: identity,
  });
});

exports.getCustomerAccounts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const customer = await findCustomer(id);
  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

  const accounts = await Account.findAll({ where: { customerId: id } });

  return res.status(200).json({
    status: 'success',
    data: accounts,
  });
});

exports.getCustomerTransactions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { fromDate, toDate } = req.query;
  let { page, limit, sortBy, sortType } = req.query;
  const attributes = ['createdAt'];
  const sortTypes = ['asc', 'desc'];
  const customer = await findCustomer(id);

  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

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
      customerId: id,
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

exports.getAllIdentities = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let { page, limit, sortBy, sortType, registrationDate } = req.query;
  const attributes = ['customerId', 'identityNumber', 'registrationDate'];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy)))
    sortBy = 'customerId';

  const filterArr = [];
  if (req.query.identityNumber) {
    const obj = {};
    obj.identityNumber = { [Op.like]: `%${req.query.identityNumber}%` };
    filterArr.push(obj);
  }

  if (req.query.customerId) {
    const obj = {};
    obj.customerId = { [Op.eq]: `${req.query.customerId}` };
    filterArr.push(obj);
  }

  if (req.query.registrationDate) {
    const obj = {};
    obj.registrationDate = {
      [Op.between]: [
        new Date(`${registrationDate}%`),
        new Date(`${registrationDate}%`).setDate(
          new Date(`${registrationDate}%`).getDate() + 1
        ),
      ],
    };
    filterArr.push(obj);
  }

  if (req.query.approved) {
    if (req.query.approved === 'true') {
      const obj = {};
      obj.staffIdApproved = { [Op.not]: null };
      filterArr.push(obj);
    }
    if (req.query.approved === 'false') {
      const obj = {};
      obj.staffIdApproved = { [Op.is]: null };
      filterArr.push(obj);
    }
  }

  const identities = await Identity.findAndCountAll({
    attributes: {
      exclude: ['frontImage', 'backImage'],
    },
    where: {
      [Op.and]: [...filterArr],
    },
    order: [[sortBy, sortType]],
    offset: (page - 1) * limit,
    limit,
  });

  return res.status(200).json({
    status: 'success',
    totalItems: identities.count,
    items: identities.rows,
  });
});

exports.getIdentity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const identity = await Identity.findOne({
    where: { id },
  });

  if (!identity) {
    return next(new AppError('Identity not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: identity,
  });
});

exports.approveCustomer = asyncHandler(async (req, res, next) => {
  const staff = req.user;
  const { idCustomer, amount } = req.body;

  const customer = await Identity.findOne({
    where: { customerId: idCustomer },
  });
  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

  if (!idCustomer) {
    return next(new AppError('Id customer is required', 400));
  }
  if (Number.isNaN(parseFloat(amount)) || !Number.isFinite(amount)) {
    return next(new AppError('Amount must be a numeric value!', 400));
  }

  customer.staffIdApproved = staff.id;
  await customer.save();

  const customerApproved = await Customer.findOne({
    attributes: {
      exclude: [
        'password',
        'verifyCode',
        'accessFailedCount',
        'passwordUpdatedAt',
      ],
    },
    where: { id: idCustomer },
  });

  customerApproved.status = STATUS.active;
  customerApproved.verifyCode = null;
  await customerApproved.save();

  await Account.create({
    customerId: idCustomer,
    type: ACCOUNT_TYPE.payment,
    currentBalance: amount,
    currentUnit: CURRENCY_UNIT.VND,
    status: STATUS.active,
    interestRate: 0,
    term: 0,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Customer has been approved.',
  });
});

exports.updateCustomerStatus = asyncHandler(async (req, res, next) => {
  const { idCustomer, status } = req.body;

  const newStatus = STATUS[status];
  if (!newStatus) {
    return next(new AppError('Invalid status!', 400));
  }
  if (
    newStatus === STATUS.deleted &&
    req.user.Role.roleDescription !== ROLE.admin
  ) {
    return next(
      new AppError('You do not have permission to perform this action!', 401)
    );
  }

  const customer = await Customer.findOne({
    attributes: {
      exclude: ['password', 'verifyCode'],
    },
    where: { id: idCustomer },
  });
  if (!customer) {
    return next(new AppError("Can't find this customer!", 404));
  }

  const identity = await Identity.findOne({
    where: { customerId: customer.id },
  });
  if (!identity) {
    return next(new AppError("Can't find customer's identity!", 404));
  }
  if (identity.staffIdApproved === null) {
    return next(
      new AppError('Cannot active, this account is not approved!', 400)
    );
  }

  customer.status = newStatus;
  customer.accessFailedCount = 0;
  await customer.save();

  return res.status(200).json({
    status: 'success',
    data: customer,
  });
});

exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const { fromDate, toDate, status } = req.query;
  let { page, limit, sortBy, sortType } = req.query;
  const attributes = [
    'accountSourceId',
    'accountDestination',
    'bankDestinationId',
    'status',
    'createdAt',
  ];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy))) sortBy = 'createdAt';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query[attr]) {
      const obj = {};
      obj[attr] = { [Op.eq]: `${req.query[attr]}` };
      filterArr.push(obj);
    }
  });

  if (status && TRANS_STATUS[status]) {
    const obj = {};
    obj.status = { [Op.eq]: TRANS_STATUS[status] };
    filterArr.push(obj);
  }

  if (req.query.createdAt && !fromDate && !toDate) {
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

  const transactions = await Transaction.findAndCountAll({
    attributes: {
      exclude: ['otpCode', 'otpCreatedDate', 'otpExpiredDate'],
    },
    where: {
      [Op.and]: [...filterArr],
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

exports.updateAccountStatus = asyncHandler(async (req, res, next) => {
  const { idAccount, status } = req.body;

  const newStatus = STATUS[status];
  if (!newStatus) {
    return next(new AppError('Invalid status!', 400));
  }
  if (
    newStatus === STATUS.deleted &&
    req.user.Role.roleDescription !== ROLE.admin
  ) {
    return next(
      new AppError('You do not have permission to perform this action!', 401)
    );
  }

  const account = await Account.findOne({
    where: { id: idAccount },
  });
  if (!account) {
    return next(new AppError("Can't find this account!", 404));
  }

  account.status = newStatus;
  await account.save();

  return res.status(200).json({
    status: 'success',
    data: account,
  });
});
