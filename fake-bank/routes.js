const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { Op } = require('sequelize');

const { signToken, verifyToken } = require('./utils');
const { Bank, Transfer } = require('./models');

// Public routes
router.post(
  '/registerBank',
  asyncHandler(async (req, res, next) => {
    let { name } = req.body;
    name = name.trim();
    const id = name.trim().split(' ').join('').toLowerCase();

    const token = signToken(id);

    const checkBank = await Bank.findOne({ where: { id } });
    if (checkBank) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bank is already existed. Please register with new name!',
      });
    }

    const bank = await Bank.create({
      id,
      name,
      key: token,
    });

    return res.status(201).json({
      status: 'success',
      bank,
    });
  })
);

// Auth routes
router.use(
  asyncHandler(async (req, res, next) => {
    // Get token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      return next(new Error('Token invalid', 400));
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) return next(new Error('Token invalid', 400));

    // Get bank
    const bank = await Bank.findOne({ where: { key: token } });
    if (!bank) {
      return res.status(404).json({
        message: 'Bank not found!',
      });
    }

    req.bank = bank;
    return next();
  })
);

router.get(
  '/banks',
  asyncHandler(async (req, res) => {
    const banks = await Bank.findAll({
      attributes: { exclude: ['key', 'createdAt', 'updatedAt'] },
      where: { id: { [Op.ne]: req.bank.id } },
    });

    return res.status(200).json({
      status: 'success',
      banks,
    });
  })
);

router
  .route('/transfers')
  .get(
    asyncHandler(async (req, res) => {
      let { page, limit } = req.query;
      if (!page || page <= 0) page = 1;
      if (!limit || limit <= 0) limit = 10;

      const transactions = await Transfer.findAndCountAll({
        where: {
          [Op.or]: {
            sourceBankId: req.bank.id,
            destinationBankId: req.bank.id,
          },
        },
        offset: (page - 1) * limit,
        limit,
      });

      return res.status(200).json({
        status: 'success',
        count: transactions.count,
        transactions: transactions.rows,
      });
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      const {
        amount,
        currency,
        destinationBankId,
        destinationAccount,
        note,
      } = req.body;

      if (amount < 0) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Bad Request!' });
      }

      if (!['VND', 'USD'].includes(currency)) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Currency must be VND or USD.' });
      }

      const transaction = await Transfer.create({
        amount,
        currency,
        sourceBankId: req.bank.id,
        destinationBankId,
        destinationAccount,
        note,
      });

      return res.status(200).json({
        status: 'success',
        transaction,
      });
    })
  );

module.exports = router;
