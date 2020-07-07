const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const ROLE = require('../utils/roleEnum');
const { STATUS } = require('../utils/statusEnum');
const { Staff, Role } = require('../models');
const passwordValidator = require('../utils/passwordValidator');
const AppError = require('../utils/appError');

const excludeAdmin = {
  model: Role,
  where: {
    roleDescription: { [Op.ne]: ROLE.admin },
  },
};

const findStaff = asyncHandler(async (id) => {
  const staff = await Staff.findOne({
    include: excludeAdmin,
    where: {
      [Op.and]: [
        { id },
        {
          status: {
            [Op.ne]: STATUS.deleted,
          },
        },
      ],
    },
  });

  return staff;
});

exports.getAllStaffs = asyncHandler(async (req, res, next) => {
  const staffs = await Staff.findAll({
    include: excludeAdmin,
  });

  return res.status(200).json({
    status: 'success',
    data: staffs,
  });
});

exports.createStaff = asyncHandler(async (req, res, next) => {
  const staffRole = await Role.findOne({
    where: { roleDescription: { [Op.eq]: ROLE.staff } },
  });

  if (!staffRole) {
    return next(new AppError("Can't find staff role!", 500));
  }

  const staff = await Staff.create({
    username: req.body.username,
    password: await passwordValidator.createHashedPassword(req.body.password),
    name: req.body.name,
    roleId: staffRole.id,
  });

  const newStaff = { ...staff.dataValues };
  delete newStaff.roleId;
  delete newStaff.password;

  return res.status(201).json({
    status: 'success',
    data: { status: 'success', data: newStaff },
  });
});

exports.getStaff = asyncHandler(async (req, res, next) => {
  const staff = await findStaff(req.params.id);

  if (!staff) {
    return next(new AppError("Can't find that staff!", 404));
  }

  return res.status(200).json({
    status: 'success',
    data: staff,
  });
});

exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const staff = await findStaff(req.params.id);

  if (!staff) {
    return next(new AppError("Can't find that staff!", 404));
  }

  staff.status = STATUS.deleted;
  staff.save();

  return res.status(200).json({
    status: 'success',
    data: staff,
  });
});

exports.updateStaffStatus = asyncHandler(async (req, res, next) => {
  const { idStaff, status } = req.body;

  const newStatus = STATUS[status];
  if (!newStatus || (newStatus && newStatus === STATUS.deleted)) {
    return next(new AppError('Status is not valid!', 400));
  }

  const staff = await findStaff(idStaff);
  if (!staff) {
    return next(new AppError("Can't find that staff!", 404));
  }

  staff.status = newStatus;
  staff.save();

  return res.status(200).json({
    status: 'success',
    data: staff,
  });
});
