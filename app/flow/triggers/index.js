const newSMS = require('./newSMS');
const newTeamMessaging = require('./newTeamMessaging');

const TRIGGERS = [
  newSMS,
  newTeamMessaging,
];

exports.TRIGGERS = TRIGGERS;
