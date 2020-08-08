const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const shortid = require('shortid');
const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../utils/appError');
const passwordValidator = require('../utils/passwordValidator');
const { STATUS } = require('../utils/enums/statusEnum');
const { Customer, Identity, Staff, Role } = require('../models');

const EmailService = require('../services/emailService');
const SmsService = require('../services/smsService');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadIdentityImages = upload.fields([
  {
    name: 'frontImage',
    maxCount: 1,
  },
  {
    name: 'backImage',
    maxCount: 1,
  },
]);

exports.compressIdentityImages = asyncHandler(async (req, res, next) => {
  if (!req.files.frontImage || !req.files.backImage)
    return next(new AppError('Please provide front and back images!', 400));

  // front image
  req.body.frontImage = await sharp(req.files.frontImage[0].buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toBuffer();

  // back image
  req.body.backImage = await sharp(req.files.backImage[0].buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toBuffer();

  next();
});

const signToken = (type, id) => {
  return jwt.sign({ type, id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.authorize = asyncHandler(async (req, res, next) => {
  // Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check user exists
  let currentUser = null;
  switch (decoded.type) {
    case 'customer':
      currentUser = await Customer.findOne({ where: { id: decoded.id } });
      break;
    case 'staff':
      currentUser = await Staff.findOne({
        include: { model: Role },
        where: { id: decoded.id },
      });
      break;
    default:
  }

  if (!currentUser || (currentUser && currentUser.status === STATUS.deleted)) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists.',
        401
      )
    );
  }

  // Check status
  switch (currentUser.status) {
    case STATUS.inactive:
      return next(new AppError('Your account is inactive!', 403));
    case STATUS.blocked:
      return next(new AppError('Your account is blocked!', 403));
    default:
  }

  // Check password changed
  if (
    currentUser.passwordUpdatedAt &&
    decoded.iat < parseInt(currentUser.passwordUpdatedAt.getTime() / 1000, 10)
  ) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS
  req.user = currentUser;
  next();
});

// Only use for admin & staff
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user.Role || !roles.includes(req.user.Role.roleDescription)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

// Only use for customer
exports.restrictToCustomer = (req, res, next) => {
  if (req.user.Role) {
    return next(
      new AppError('You do not have permission to perform this action.', 403)
    );
  }
  next();
};

exports.customerLogin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email and password exist
  if (!username || !password) {
    return next(
      new AppError('Please provide username/email and password!', 400)
    );
  }

  // Check if customer exists && password is correct
  const customer = await Customer.findOne({
    where: {
      [Op.or]: [{ username }, { email: username }],
      status: { [Op.ne]: STATUS.deleted },
    },
  });

  // Check if customer is blocked or inactive
  if (customer) {
    switch (customer.status) {
      case STATUS.inactive:
        return next(new AppError('Your account is inactive!', 400));
      case STATUS.blocked:
        return next(new AppError('Your account is blocked!', 400));
      default:
    }
  }

  if (
    !customer ||
    !(await passwordValidator.verifyHashedPassword(password, customer.password))
  ) {
    if (customer && customer.accessFailedCount < 5) {
      customer.accessFailedCount += 1;
      await customer.save();
    }

    return next(new AppError('Incorrect username/email or password', 400));
  }

  // Check if user access failed 5 times
  if (customer.accessFailedCount === 5) {
    if (customer.status !== STATUS.blocked) {
      customer.status = STATUS.blocked;
      await customer.save();
    }

    return next(
      new AppError(
        'Your account is blocked! You have logged in failed 5 times!',
        400
      )
    );
  }

  // Reset access failed if login success before 5 times
  customer.accessFailedCount = 0;
  await customer.save();

  // Create login token and send to client
  const token = signToken('customer', customer.id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});

exports.customerRegister = asyncHandler(async (req, res, next) => {
  const {
    email,
    username,
    password,
    name,
    dateOfBirth,
    phoneNumber,
    address,

    identityNumber,
    registrationDate,
    frontImage,
    backImage,
  } = req.body;

  const regexPwd = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/gm;
  const regexDoB = /^\d{4}[/-]\d{2}[/-]\d{2}$/gm;
  const regexIdentNum = /^[0-9]{9}$|^[0-9]{12}$/gm;
  const regexRegDate = /^\d{4}[/-]\d{2}[/-]\d{2}$/gm;
  const matchedPwd = regexPwd.exec(password);
  const matchedDoB = regexDoB.exec(dateOfBirth);
  const matchedIdentNum = regexIdentNum.exec(identityNumber);
  const matchedRegDate = regexRegDate.exec(registrationDate);

  if (!matchedPwd) {
    return next(
      new AppError(
        'Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
        400
      )
    );
  }

  if (!matchedDoB) {
    return next(new AppError('Date of birth is invalid', 400));
  }

  if (!identityNumber || !registrationDate || !frontImage || !backImage) {
    return next(new AppError('Please provide a full identity.', 400));
  }

  if (!matchedIdentNum) {
    return next(
      new AppError('Identity number must be 9 or 12 characters in length.', 400)
    );
  }

  if (!matchedRegDate) {
    return next(new AppError('Date of registration is invalid', 400));
  }

  const foundIdentity = await Identity.findOne({ where: { identityNumber } });
  if (foundIdentity) {
    return next(new AppError('Identity number is already existed.', 400));
  }

  // Create new customer
  const customer = await Customer.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password: await passwordValidator.createHashedPassword(password),
    name,
    dateOfBirth,
    phoneNumber,
    address,
    verifyCode: shortid.generate(),
  });

  await Identity.create({
    customerId: customer.id,
    identityNumber,
    registrationDate,
    frontImage: req.body.frontImage,
    backImage: req.body.backImage,
  });

  // Create login token and send to client
  const token = signToken('customer', customer.id);

  return res.status(201).json({
    status: 'success',
    token,
  });
});

exports.staffLogin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email and password exist
  if (!username || !password) {
    return next(
      new AppError('Please provide username/email and password!', 400)
    );
  }

  // Check if staff exists && password is correct
  const staff = await Staff.findOne({
    where: {
      username,
      status: { [Op.ne]: STATUS.deleted },
    },
  });

  // Check if staff is blocked or inactive
  if (staff) {
    switch (staff.status) {
      case STATUS.inactive:
        return next(new AppError('Your account is inactive!', 400));
      case STATUS.blocked:
        return next(new AppError('Your account is blocked!', 400));
      default:
    }
  }

  if (
    !staff ||
    !(await passwordValidator.verifyHashedPassword(password, staff.password))
  ) {
    return next(new AppError('Incorrect username/email or password', 400));
  }

  // Create login token and send to client
  const token = signToken('staff', staff.id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const customer = await Customer.findOne({
    where: {
      email,
    },
  });

  if (!customer) {
    return next(new AppError('Email not found', 404));
  }

  customer.verifyCode = shortid.generate();
  await customer.save();

  const { verifyCode } = customer;

  // Send otp code to user
  const emailService = new EmailService(customer);
  await emailService.sendResetPasswordCode(verifyCode);

  // Send otp code to user with SMS
  if (process.env.SMS_ENABLE_OTP === 'true') {
    const sms = new SmsService(customer);
    await sms.sendResetPasswordCode(verifyCode);
  }

  return res.status(200).json({
    status: 'success',
    message: 'Verify code was sent to your email/phone!',
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, verifyCode, newPwd } = req.body;

  if (!email || !verifyCode) {
    return next(new AppError('Please provide email and verifyCode!', 400));
  }

  const customer = await Customer.findOne({
    where: {
      email,
      verifyCode,
    },
  });

  if (!customer) {
    return next(
      new AppError('Email/verifyCode is incorrect. Please try again!', 400)
    );
  }

  const regexPwd = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/gm;
  const matchedPwd = regexPwd.exec(newPwd);

  if (!matchedPwd) {
    return next(
      new AppError(
        'Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
        400
      )
    );
  }

  customer.password = await passwordValidator.createHashedPassword(newPwd);
  customer.verifyCode = null;
  customer.passwordUpdatedAt = new Date();
  await customer.save();

  return res.status(200).json({
    status: 'success',
    message: 'Your password have been reset!',
  });
});
