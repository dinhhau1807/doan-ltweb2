const asyncHandler = require('express-async-handler');

const { Op } = require('sequelize');
const { Customer, Identity } = require('../models');
const AppError = require('../utils/appError');

// test method
exports.getAllCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.findAll();
  res.status(200).json({ status: 'success', data: customers });
});

exports.customerIdentification = asyncHandler(async (req, res, next) => {
  // const customer = req.user;
  // if (!customer) {
  //   return next(
  //     new AppError('You are not logged in! Please log in to get access.', 401)
  //   );
  // }
  const {
    customerId,
    identityNumber,
    registrationDate,
    fontImage,
    backImage,
    staffIdApproved,
  } = req.body;

  const regexDate = /^\d{4}[/-]\d{2}[/-]\d{2}$/gm;
  const matchedDate = regexDate.exec(registrationDate);

  const findMatches = await Identity.findOne({
    where: {
      [Op.and]: [
        {
          customerId: {
            [Op.eq]: customerId,
          },
        },
        {
          identityNumber: {
            [Op.eq]: identityNumber,
          },
        },
        {
          registrationDate: {
            [Op.eq]: registrationDate,
          },
        },
      ],
    },
  });

  if (!matchedDate) {
    return next(new AppError('Registration date invalid', 400));
  }

  if (findMatches) {
    return next(
      new AppError('You have sent a previous identification request', 400)
    );
  }

  await Identity.create({
    customerId: customerId,
    identityNumber: identityNumber,
    registrationDate: registrationDate,
    fontImage: fontImage,
    backImage: backImage,
    staffIdApproved: staffIdApproved,
  });

  return res.status(201).json({
    status: 'success',
    message: 'You have sent a identification request successfully',
  });
});
