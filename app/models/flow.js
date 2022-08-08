const Sequelize = require('sequelize');
const { sequelize } = require('./sequelize');

const Flow = sequelize.define('flows', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.STRING,
  },
  nodes: {
    type: Sequelize.JSON,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
  },
}, {
  indexes: [
    {
      fields: ['userId'],
    },
  ],
});

exports.Flow = Flow;
