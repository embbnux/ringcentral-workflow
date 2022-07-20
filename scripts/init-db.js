require('dotenv').config();
const { User } = require('../app/models/user');

async function initDB() {
  await User.sync({ alter: true });
}

initDB();
