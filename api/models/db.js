const Sequelize = require('sequelize');

const db = process.env.DATABASE_PRODUCTION || process.env.DATABASE_LOCALHOST;

// Connect database
const sequelize = new Sequelize(db, {
  logging: process.env.DATABASE_LOGS === 'true',
});

module.exports = sequelize;
