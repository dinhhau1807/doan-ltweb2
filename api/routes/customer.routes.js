const express = require('express');

const authController = require('../controllers/auth.controller');
const customerController = require('../controllers/customer.controller');

const router = express.Router();

// Public route
router.post('/login', authController.customerLogin);
router.post(
  '/register',
  authController.uploadIdentityImages,
  authController.compressIdentityImages,
  authController.customerRegister
);

// Auth route
router.use(authController.authorize, authController.restrictToCustomer);

router
  .route('/me')
  .get(customerController.getInfo)
  .put(customerController.updateInfo);

router.put('/updatePassword', customerController.updatePassword);

router.get('/transactionHistory', customerController.transactionsHistory);

router.post(
  '/internalTransferRequest',
  customerController.internalTransferRequest
);
router.post(
  '/internalTransferConfirm',
  customerController.internalTransferConfirm
);

router.post(
  '/registerSavingsAccount',
  customerController.registerSavingAccount
);
router.get('/savingsAccount', customerController.getAllSavingsAccount);
router.get('/savingsHistory', customerController.savingsTransactionsHistory);

router.get('/paymentAccount', customerController.getPaymentAccount);

module.exports = router;
