const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const {
  Customer,
  Account,
  Transaction,
  Staff,
  Identity,
} = require('../models');

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

router.post(
  '/approve',
  asyncHandler(async (req, res, next) => {
    const customers = await Customer.findAll();
    customers.forEach(async (customer) => {
      customer.status = 'active';
      await customer.save();
    });

    const staffs = await Staff.findAll({ username: { [Op.ne]: 'admin' } });
    const staffIds = staffs.map((staff) => staff.id);

    const identities = await Identity.findAll();
    identities.forEach(async (identity) => {
      const staffRandom = staffIds[Math.floor(Math.random() * staffIds.length)];
      identity.staffIdApproved = staffRandom;
      await identity.save();
    });

    return res.status(200).json({
      status: 'success',
    });
  })
);

module.exports = router;
