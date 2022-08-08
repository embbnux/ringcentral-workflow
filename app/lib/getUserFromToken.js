const { decodeJwt } = require('./jwt');
const { User } = require('../models/User');

async function getUserFromToken(jwtToken) {
  if (!jwtToken) {
    return null;
  }
  const decodedToken = decodeJwt(jwtToken);
  if (!decodedToken) {
    return null;
  }
  const userId = decodedToken.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
}

exports.getUserFromToken = getUserFromToken;
