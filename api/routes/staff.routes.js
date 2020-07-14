const express = require('express');

const ROLE = require('../utils/roleEnum');
const authController = require('../controllers/auth.controller');
const staffController = require('../controllers/staff.controller');

const router = express.Router();

// Public route
router.post('/login', authController.staffLogin);

// Auth route
router.use(
  authController.authorize,
  authController.restrictTo(ROLE.staff, ROLE.admin)
);

router
  .route('/me')
  .get(staffController.getInfo)
  .put(staffController.updateInfo);

router.put('/updatePassword', staffController.updatePassword);

router.post('/customers/status', staffController.updateCustomerStatus);
router.post('/customers/approve', staffController.approveCustomer);

router.get('/customers', staffController.getAllCustomers);
router.get('/customers/:id', staffController.getCustomer);
router.get('/customers/:id/identity', staffController.getCustomerIdentity);
router.get('/customers/:id/accounts', staffController.getCustomerAccounts);
router.get(
  '/customers/:id/transactions',
  staffController.getCustomerTransactions
);

router.get('/identities', staffController.getAllIdentities);
router.get('/identities/:id', staffController.getIdentity);

module.exports = router;
