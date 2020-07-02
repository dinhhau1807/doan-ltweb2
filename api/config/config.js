// For using command-line
require('dotenv').config({ path: './.env' });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variables: 'DATABASE_URL',
    dialect: 'postgres',
  },
};
