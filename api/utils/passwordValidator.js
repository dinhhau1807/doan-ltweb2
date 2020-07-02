const bcrypt = require('bcryptjs');

const round = 10;

exports.createHashedPassword = async (password) => {
  return await bcrypt.hash(password, round);
};

exports.verifyHashedPassword = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};
