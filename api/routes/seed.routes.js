const express = require('express');
const asyncHandler = require('express-async-handler');

const { Customer, Account, Transaction } = require('../models');

const router = express.Router();

router.get('/customers', async (req, res, next) => {
  const customers = await Customer.findAll();
  res.status(200).json({ customers });
});

router.get('/accounts', async (req, res, next) => {
  const accounts = await Account.findAll();
  res.status(200).json({ accounts });
});

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
      currencyUnit,
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
      currencyUnit,
      description,
      status,
      otpCode,
      otpCreatedDate,
      otpExpiredDate,
    });

    res.status(200).json({
      data: { id: transaction.id, accountSourceId, accountDestination },
    });
  })
);

module.exports = router;
