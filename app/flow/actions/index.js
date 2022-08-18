const sendSMS = require('./sms');
const sendTeamMessage = require('./teamMessage');
const webhook = require('./webhook');

const ACTIONS = [
  sendSMS,
  sendTeamMessage,
  webhook,
];

exports.ACTIONS = ACTIONS;
