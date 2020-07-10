const express = require('express');

const authController = require('../controllers/auth.controller');
const customerController = require('../controllers/customer.controller');

const router = express.Router();

// Public route
router.post('/login', authController.customerLogin);
router.post('/register', authController.customerRegister);

// Auth route
// router.use(authController.authorize);

// test route
router.get('/getAll', customerController.getAllCustomers);
router.post('/verify', customerController.customerIdentification);

module.exports = router;
