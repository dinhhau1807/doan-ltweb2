const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const SECRET_KEY = 'BANK_SECRET';

exports.SECRET_KEY = SECRET_KEY;

exports.signToken = (id) => {
  return jwt.sign({ id }, SECRET_KEY);
};

exports.verifyToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};
