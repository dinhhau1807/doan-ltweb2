const tz = require('moment-timezone');
const moment = require('moment').tz.setDefault('Asia/Ho_Chi_Minh');
const momentRd = require('moment-random');

const startDate = moment({ year: 1950 });
const endDate = moment({ year: moment().year() - 18 });

exports.dateRandom = () => {
  return momentRd(endDate, startDate);
};

exports.getRandomInt = (min, max) => {
  // Max and min is inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
