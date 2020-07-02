const express = require('express');

const authController = require('../controllers/auth.controller');
const customerController = require('../controllers/customer.controller');

const router = express.Router();

// test route
router.get('/getAll', customerController.getAllCustomers);

// Public route
router.post('/login', authController.customerLogin);

// Auth route

module.exports = router;
