const express = require('express');

// const ROLE = require('../utils/roleEnum');
const authController = require('../controllers/auth.controller');
const staffController = require('../controllers/staff.controller');

const router = express.Router();

// Public route
router.post('/login', authController.staffLogin);

// Auth route
// router.use(authController.authorize, authController.restrictTo(ROLE.staff, ROLE.admin));

router.get('/customers', staffController.getAllCustomers);
router.post('/customers/status', staffController.updateCustomerStatus);
router.post('/customers/approve', staffController.approveCustomer);

module.exports = router;
