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
  });
});

exports.getAllCustomer = asyncHandler(async (req, res, next) => {
  const {
    page,
    size,
    sortBy,
    sortType = 'desc',
    username,
    email,
    name,
    phoneNumber,
    address,
  } = req.query;
  const attributes = ['username', 'email', 'name', 'phoneNumber', 'address'];
  const typeSort = ['asc', 'desc'];
  const { limit, offset } = getPagination(page, size);

  if (Object.keys(req.query).length === 0) {
    const customer = await Customer.findAndCountAll({
      attributes: attributes,
      limit,
      offset,
    });
    return res.status(200).json({
      status: 'success',
      totalItems: customer.count,
      items: customer.rows,
    });
  }

  if (!attributes.includes(sortBy) || !typeSort.includes(sortType)) {
    return next(new AppError('Property invalid!', 400));
  }

  if (Object.keys(req.query).length === 1) {
    const customer = await Customer.findAndCountAll({
      attributes: attributes,
      limit,
      offset,
      order: [[sortBy, 'desc']],
    });
    return res.status(200).json({
      status: 'success',
      totalItems: customer.count,
      items: customer.rows,
    });
  }

  if (Object.keys(req.query).length === 2) {
    const customer = await Customer.findAndCountAll({
      attributes: attributes,
      limit,
      offset,
      order: [[sortBy, sortType]],
    });
    return res.status(200).json({
      status: 'success',
      totalItems: customer.count,
      items: customer.rows,
    });
  }

  const customer = await Customer.findAndCountAll({
    attributes: attributes,
    where: {
      [Op.or]: [
        {
          username: {
            [Op.or]: {
              [Op.like]: `%${username}%`,
              [Op.eq]: null,
            },
          },
        },
        {
          email: {
            [Op.or]: {
              [Op.like]: `%${email}%`,
              [Op.eq]: null,
            },
          },
        },
        {
          name: {
            [Op.or]: {
              [Op.like]: `%${name}%`,
              [Op.eq]: null,
            },
          },
        },
        {
          phoneNumber: {
            [Op.or]: {
              [Op.like]: `%${phoneNumber}%`,
              [Op.eq]: null,
            },
          },
        },
        {
          address: {
            [Op.or]: {
              [Op.like]: `%${address}%`,
              [Op.eq]: null,
            },
          },
        },
      ],
    },
    limit,
    offset,
    order: [[sortBy, sortType]],
  });

  return res.status(200).json({
    status: 'success',
    totalItems: customer.count,
    items: customer.rows,
  });
});
