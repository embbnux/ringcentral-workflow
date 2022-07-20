const { sign, verify } = require('jsonwebtoken');

function encodeJwt(data) {
  return sign(data, process.env.APP_SERVER_SECRET_KEY, { expiresIn: '120y' })
}

function decodeJwt(token) {
  try {
    return verify(token, process.env.APP_SERVER_SECRET_KEY);
  } catch (e) {
    return null;
  }
}

exports.encodeJwt = encodeJwt;
exports.decodeJwt = decodeJwt;
