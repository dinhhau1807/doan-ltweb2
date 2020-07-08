const express = require('express');

// const ROLE = require('../utils/roleEnum');
// const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Public route
// router.post('/login', authController.staffLogin);

// Auth route
// router.use(authController.authorize, authController.restrictTo(ROLE.admin));

// router.get('/', adminController.getMe);

router
  .route('/staffs')
  .get(adminController.getAllStaffs)
  .post(adminController.createStaff);

router
  .route('/staffs/:id')
  .get(adminController.getStaff)
  .delete(adminController.deleteStaff);

router.post('/staffs/status', adminController.updateStaffStatus);

module.exports = router;
