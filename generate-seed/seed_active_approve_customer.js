require('dotenv').config({ path: './.env' });
const axios = require('axios');

const config = {
  method: 'post',
  url: `${process.env.URL}/api/seeds/approve`,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
