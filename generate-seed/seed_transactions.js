require('dotenv').config({ path: './.env' });
var axios = require('axios');
const tz = require('moment-timezone');
const moment = require('moment').tz.setDefault('Asia/Ho_Chi_Minh');
const { getRandomInt } = require('./utils');

function generateOTP() {
  let digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

axios
  .get(`${process.env.URL}/api/seeds/accounts`)
  .then((result) => {
    return result.data.accounts
      .map((account) => +account.id)
      .sort((a, b) => a - b);
  })
  .then((ids) => {
    for (let id of ids) {
      const now = moment();
      let accountDestination = ids[getRandomInt(0, ids.length - 1)];
      while (accountDestination === id) {
        accountDestination = ids[getRandomInt(0, ids.length - 1)];
      }

      const data = {
        accountSourceId: id,
        accountDestination,
        amount: getRandomInt(100000, 2000000),
        description: `User ${id} transfer to user ${accountDestination}`,
        status: 'succeed',
        otpCode: generateOTP(),
        otpCreatedDate: now.format(),
        otpExpiredDate: now.add(5, 'minutes').format(),
      };

      const config = {
        method: 'post',
        url: `${process.env.URL}/api/seeds/transactions`,
        headers: {},
        data: data,
      };

      axios(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  })
  .catch((error) => {
    console.log(error);
  });
