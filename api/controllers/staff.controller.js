const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');
const { STATUS } = require('../utils/statusEnum');
const { Customer, Identity } = require('../models');

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

const getPagination = (page, limit) => {
  const size = limit ? +limit : 10;
  const offset = page ? page * limit : 1;

  return { size, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: customers } = data;
  return { totalItems, customers };
};

exports.updateCustomerStatus = asyncHandler(async (req, res, next) => {
  const { idCustomer, status } = req.body;

  const newStatus = STATUS[status];
  if (!newStatus || (newStatus && newStatus === STATUS.deleted)) {
    return next(new AppError('Invalid status!', 400));
  }

  const customer = await findCustomer(idCustomer);
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

  const { size, offset } = getPagination(page, limit);

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
    offset,
    limit: size,
  });

  const listCustomers = getPagingData(customers, page, size);

  if (customers.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'Customer not found!',
    });
  }

  return res.status(200).json({
    status: 'success',
    totalItems: listCustomers.totalItems,
    items: listCustomers.customers,
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
  customer.save();

  return res.status(200).json({
    status: 'success',
    message: 'Customer has been approved',
  });
});
