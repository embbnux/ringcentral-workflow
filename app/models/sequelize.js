const { Sequelize } = require('sequelize');

let option;
if (process.env.DB_SSL_UNSAFE === 'true') {
  option = {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  };
}

const sequelize = new Sequelize(process.env.DATABASE_URL, option);

exports.sequelize = sequelize;
