require('dotenv').config({ path: './.env' });
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { dateRandom } = require('./utils');

const count = 50;
for (let i = 0; i < count; i++) {
  const dateOfBirth = dateRandom();
  const registrationDate = dateOfBirth.add(18, 'year');

  const data = new FormData();
  data.append('username', `democust${i + 1}`);
  data.append('email', `democust${i + 1}@example.com`);
  data.append('password', '1234@Demo');
  data.append('name', `demo${i + 1}`);
  data.append('dateOfBirth', dateOfBirth.format('YYYY/MM/DD'));
  data.append('phoneNumber', `+84${909123456 + i}`);
  data.append('address', `${1234 + i}`);
  data.append('identityNumber', `${123456789 + i}`);
  data.append('registrationDate', registrationDate.format('YYYY/MM/DD'));
  data.append(
    'frontImage',
    fs.createReadStream(__dirname + '/assets/frontImage.jpg')
  );
  data.append(
    'backImage',
    fs.createReadStream(__dirname + '/assets/backImage.png')
  );

  const config = {
    method: 'post',
    url: `${process.env.URL}/api/customers/register`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}
