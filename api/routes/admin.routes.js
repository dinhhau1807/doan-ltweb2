const express = require('express');

const ROLE = require('../utils/roleEnum');
const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Public route
router.post('/login', authController.staffLogin);

// Auth route
router.use(authController.authorize, authController.restrictTo(ROLE.admin));

router
  .route('/staffs')
  .get(adminController.getAllStaffs)
  .post(adminController.createStaff);

router.post('/staffs/status', adminController.updateStaffStatus);
router.get('/staffs/:id', adminController.getStaff);

module.exports = router;
