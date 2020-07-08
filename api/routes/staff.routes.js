const express = require('express');

const staffController = require('../controllers/staff.controller');

const router = express.Router();

// Public route

// Auth route
router.get('/customers', staffController.getAllCustomers);
router.post('/customers/status', staffController.updateCustomerStatus);

module.exports = router;
