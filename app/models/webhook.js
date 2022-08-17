const Sequelize = require('sequelize');
const { sequelize } = require('./sequelize');

const Webhook = sequelize.define('webhooks', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  expiredAt: {
    type: Sequelize.DATE,
  },
  subscription: {
    type: Sequelize.JSON,
  },
}, {
  indexes: [
    {
      fields: ['userId'],
    },
  ],
});

exports.Webhook = Webhook;
