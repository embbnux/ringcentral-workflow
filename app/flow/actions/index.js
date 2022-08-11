const sendSMS = require('./sms');
const sendTeamMessage = require('./teamMessage');

const ACTIONS = [
  sendSMS,
  sendTeamMessage,
];

exports.ACTIONS = ACTIONS;
