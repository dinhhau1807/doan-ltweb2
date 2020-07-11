const express = require('express');
const asyncHandler = require('express-async-handler');

const { Account, Transaction } = require('../models');

const router = express.Router();

router.post(
  '/accounts',
  asyncHandler(async (req, res, next) => {
    const {
      customerId,
      type,
      currentBalance,
      currentUnit,
      status,
      interestRate,
      term,
    } = req.body;

    const account = await Account.create({
      customerId,
      type,
      currentBalance,
      currentUnit,
      status,
      interestRate,
      term,
    });

    res.status(200).json({
      data: { id: account.id, customerId },
    });
  })
);

router.post(
  '/transactions',
  asyncHandler(async (req, res, next) => {
    const {
      accountSourceId,
      accountDestination,
      bankDestinationId,
      amount,
      description,
      status,
      otpCode,
      otpCreatedDate,
      otpExpiredDate,
    } = req.body;

    const transaction = await Transaction.create({
      accountSourceId,
      accountDestination,
      bankDestinationId,
      amount,
      description,
      status,
      otpCode,
      otpCreatedDate,
      otpExpiredDate,
    });

    res.status(200).json({
      data: { id: transaction.id, accountSourceId },
    });
  })
);

module.exports = router;
