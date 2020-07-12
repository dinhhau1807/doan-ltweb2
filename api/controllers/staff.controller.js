const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');
const { STATUS } = require('../utils/statusEnum');
const ROLE = require('../utils/roleEnum');
const { Customer, Identity, Account, Transaction } = require('../models');

const findCustomer = asyncHandler(async (id) => {
  const customer = await Customer.findOne({
    attributes: {
      exclude: ['password', 'verifyCode'],
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

  customer.status = newStatus;
  customer.save();

  return res.status(200).json({
    status: 'success',
    data: customer,
  });
});

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
      exclude: ['password', 'verifyCode'],
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

exports.approveCustomer = asyncHandler(async (req, res, next) => {
  const staff = req.user;
  const { idCustomer } = req.body;

  const customer = await Identity.findOne({
    where: { customerId: idCustomer },
  });
  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

  customer.staffIdApproved = staff.id;
  await customer.save();

  const customerApproved = await Customer.findOne({
    attributes: {
      exclude: ['password', 'verifyCode'],
    },
    where: { id: idCustomer },
  });

  customerApproved.status = STATUS.active;
  await customerApproved.save();

  return res.status(200).json({
    status: 'success',
    message: 'Customer has been approved',
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

exports.getCustomerAccounts = asyncHandler(async (req, res, next) => {
  const { idCustomer } = req.body;

  const customer = await findCustomer(idCustomer);
  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

  const accounts = await Account.findAll({ where: { customerId: idCustomer } });

  return res.status(200).json({
    status: 'success',
    data: accounts,
  });
});

exports.getCustomerTransactions = asyncHandler(async (req, res, next) => {
  const { idCustomer } = req.body;

  const customer = await findCustomer(idCustomer);
  if (!customer) {
    return next(new AppError('Customer not found.', 404));
  }

  const transactions = await Transaction.findAll({
    where: {
      [Op.or]: { accountSourceId: idCustomer, accountDestination: idCustomer },
    },
  });

  return res.status(200).json({
    status: 'success',
    data: transactions,
  });
});

exports.getAllIdentities = asyncHandler(async (req, res, next) => {
  let { page, limit, sortBy, sortType } = req.query;
  const attributes = [
    'customerId',
    'identityNumber',
    'registrationDate',
    'frontImage',
    'backImage',
  ];
  const sortTypes = ['asc', 'desc'];

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy)))
    sortBy = 'customerId';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query[attr]) {
      const obj = {};
      obj[attr] = { [Op.like]: `%${req.query[attr]}%` };
      filterArr.push(obj);
    }
  });

  const identities = await Identity.findAndCountAll({
    attributes: {
      exclude: ['frontImage', 'backImage', 'staffIdApproved'],
    },
    where: {
      ...filterArr,
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
  const identity = await Identity.findOne({
    where: {
      id: req.params.idCustomer,
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
