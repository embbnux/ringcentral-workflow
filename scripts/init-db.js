require('dotenv').config();

const { Flow } = require('../app/models/flow');
const { User } = require('../app/models/user');
const { Webhook } = require('../app/models/webhook');

async function initDB() {
  await User.sync({ alter: true });
  await Flow.sync({ alter: true });
  await Webhook.sync({ alter: true });
}

initDB();
