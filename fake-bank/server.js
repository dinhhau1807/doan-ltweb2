require('dotenv').config({ path: './.env' });

const port = process.env.PORT || process.env.LOCAL_PORT;
const app = require('./app');
var db = require('./models');

// Connect database
db.sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Listen app
const server = app.listen(port, () => {
  console.log(`Fake-bank api running on port ${port}`);
});
