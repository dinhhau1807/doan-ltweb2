const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');
const { STATUS } = require('../utils/statusEnum');
const { Customer } = require('../models');

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
