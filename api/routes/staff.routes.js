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

router.get('/customers', staffController.getAllCustomers);
router.get('/customers/identities', staffController.getAllIdentities);
router.get('/customers/identities/:idCustomer', staffController.getIdentity);
router.post('/customers/status', staffController.updateCustomerStatus);
router.post('/customers/approve', staffController.approveCustomer);

router.get('/customers/transactions', staffController.getCustomerTransactions);
router.get('/customers/accounts', staffController.getCustomerAccounts);
router.get('/customers/:id', staffController.getCustomer);

router
  .route('/me')
  .get(staffController.getInfo)
  .put(staffController.updateInfo);

router.put('/updatePassword', staffController.updatePassword);

module.exports = router;
