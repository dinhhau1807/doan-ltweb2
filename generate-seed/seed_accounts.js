require('dotenv').config({ path: './.env' });
var axios = require('axios');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

axios
  .get(`${process.env.URL}/api/seeds/customers`)
  .then((result) => {
    return result.data.customers
      .map((customer) => +customer.id)
      .sort((a, b) => a - b);
  })
  .then((ids) => {
    for (let id of ids) {
      const data = {
        customerId: id,
        type: 'payment',
        currentBalance: getRandomInt(1000000, 100000001),
        currentUnit: 'VND',
        status: 'active',
        interestRate: 0,
        term: 0,
      };

      const config = {
        method: 'post',
        url: `${process.env.URL}/api/seeds/accounts`,
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
