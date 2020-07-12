const tz = require('moment-timezone');
const moment = require('moment').tz.setDefault('Asia/Ho_Chi_Minh');
const momentRd = require('moment-random');

const startDate = moment({ year: 1950 });
const endDate = moment({ year: moment().year() - 18 });

module.exports = () => {
  return momentRd(endDate, startDate);
};
