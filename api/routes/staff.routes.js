const express = require('express');

const staffController = require('../controllers/staff.controller');

const router = express.Router();

// Public route

// Auth route
router.post('/status', staffController.updateStatus);

module.exports = router;
