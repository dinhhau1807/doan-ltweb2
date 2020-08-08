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
router.get('/depositTerms', customerController.getDepositTerms);
router.post('/forgotPassword', authController.forgotPassword);

// Auth route
router.use(authController.authorize, authController.restrictToCustomer);

router
  .route('/me')
  .get(customerController.getInfo)
  .put(customerController.updateInfo);
router.put('/updatePassword', customerController.updatePassword);

router.get('/account', customerController.getPaymentAccount);
router.get('/transactionHistory', customerController.transactionsHistory);
router.post(
  '/internalTransferRequest',
  customerController.internalTransferRequest
);
router.post(
  '/internalTransferConfirm',
  customerController.internalTransferConfirm
);

router.get('/deposit', customerController.getAllDeposit);
router.get('/deposit/:id', customerController.getDeposit);
router.get('/depositHistory', customerController.depositHistory);
router.post(
  '/depositRegisterRequest',
  customerController.depositRegisterRequest
);
router.post(
  '/depositRegisterConfirm',
  customerController.depositRegisterConfirm
);
router.post('/withdrawRequest', customerController.withdrawalOfDepositRequest);
router.post('/withdrawConfirm', customerController.withdrawalOfDepositConfirm);

module.exports = router;
