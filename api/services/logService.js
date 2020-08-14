const AppError = require('../utils/appError');
const { Log } = require('../models');

module.exports = class LogService {
  static async saveLog(staffId, title, data) {
    try {
      return await Log.create({ staffId, title, data });
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  static async getLogs(options) {
    return await Log.findAndCountAll(options);
  }
};
