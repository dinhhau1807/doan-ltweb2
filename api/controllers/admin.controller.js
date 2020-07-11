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
    attributes: {
      exclude: ['password', 'roleId'],
    },
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

const getPagination = (page, limit) => {
  const size = limit ? +limit : 10;
  const offset = page ? page * limit : 1;

  return { size, offset };
};

const getPagingData = (data) => {
  const { count: totalItems, rows: staffs } = data;
  return { totalItems, staffs };
};

exports.getAllStaffs = asyncHandler(async (req, res, next) => {
  const attributes = ['username', 'name'];
  const sortTypes = ['asc', 'desc'];
  let { sortBy, sortType, page, limit } = req.query;

  if (!page || page <= 0) page = 1;
  if (!limit || limit <= 0) limit = 10;

  if (!sortType || (sortType && !sortTypes.includes(sortType)))
    sortType = 'asc';
  if (!sortBy || (sortBy && !attributes.includes(sortBy))) sortBy = 'updatedAt';

  const filterArr = [];
  attributes.forEach((attr) => {
    if (req.query[attr]) {
      const obj = {};
      obj[attr] = { [Op.like]: `%${req.query[attr]}%` };
      filterArr.push(obj);
    }
  });

  const { size, offset } = getPagination(page, limit);

  const staffs = await Staff.findAndCountAll({
    include: excludeAdmin,
    attributes: {
      exclude: ['password', 'roleId'],
    },
    where: {
      [Op.and]: [
        {
          status: {
            [Op.ne]: STATUS.deleted,
          },
        },
        ...filterArr,
      ],
    },
    order: [[sortBy, sortType]],
    offset,
    limit: size,
  });

  const listStaffs = getPagingData(staffs);

  return res.status(200).json({
    status: 'success',
    totalItems: listStaffs.totalItems,
    items: listStaffs.staffs,
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
    data: newStaff,
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
