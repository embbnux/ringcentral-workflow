require('dotenv').config();

const { Flow } = require('../app/models/flow');
const { User } = require('../app/models/user');

async function initDB() {
  await User.sync({ alter: true });
  await Flow.sync({ alter: true });
}

initDB();
