const { decodeJwt } = require('../lib/jwt');
const { User } = require('../models/User');

async function userInfo(req, res) {
  const jwtToken = req.query.token;
  if (!jwtToken) {
    res.status(403);
    res.json({ result: 'error', message: 'Error params' });
    return;
  }
  const decodedToken = decodeJwt(jwtToken);
  if (!decodedToken) {
    res.status(401);
    res.json({ result: 'error', message: 'Token invalid.' });
    return;
  }
  const userId = decodedToken.id;
  const user = await User.findByPk(userId);
  if (!user) {
    res.status(401);
    res.json({ result: 'error', message: 'Token invalid.' });
  }
  res.status(200);
  res.json({ name: user.name });
}

exports.userInfo = userInfo;
