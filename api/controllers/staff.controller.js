const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');
const { STATUS } = require('../utils/statusEnum');
const { Customer } = require('../models');

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: customers } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, customers, totalPages, currentPage };
};

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { idCustomer, status } = req.body;
  const customer = await Customer.findOne({
    where: { [Op.or]: [{ id: idCustomer }] },
  });

  const newStatus = STATUS[status];

  if (!newStatus || (newStatus && customer.status === newStatus)) {
    return next(new AppError('Fail update status!', 400));
  }

  customer.status = newStatus;
  customer.save();
  return res.status(200).json({
    status: 'success',
    data: { status: 'success' },
  });
});

exports.getAllCustomer = asyncHandler(async (req, res, next) => {
  const { page, size, search, sortBy, sortType } = req.query;
  const attributes = ['username', 'email', 'name', 'phoneNumber', 'address'];
  const typeSort = ['asc', 'desc'];
  const condition = search ? { [sortBy]: { [Op.like]: `%${search}%` } } : null;
  const { limit, offset } = getPagination(page, size);

  if (!attributes.includes(sortBy) || !typeSort.includes(sortType)) {
    return next(new AppError('Property invalid!', 400));
  }

  const customer = await Customer.findAndCountAll({
    attributes: attributes,
    where: condition,
    limit,
    offset,
    order: [[sortBy, sortType]],
  });

  const listCustomer = getPagingData(customer, page, limit);
  return res.status(200).json({
    status: 'success',
    data: { status: 'success', listData: listCustomer },
  });
});
