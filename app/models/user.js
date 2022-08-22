const Sequelize = require('sequelize');
const { sequelize } = require('./sequelize');

const User = sequelize.define('users', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  accountId: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.JSON,
  },
  name: {
    type: Sequelize.STRING,
  },
});

exports.User = User;
