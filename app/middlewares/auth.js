const { decodeJwt } = require('../lib/jwt');
const { User } = require('../models/User');

async function checkAuth(req, res, next) {
  const jwtToken = req.headers['x-access-token'];
  if (!jwtToken) {
    res.status(401);
    res.json({ result: 'error', message: 'Token required.' });
    return;
  }
  const decodedToken = decodeJwt(jwtToken);
  if (!decodedToken) {
    res.status(401);
    res.json({ result: 'error', message: 'Token invalid.' });
    return;
  }
  const userId = decodedToken.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(401);
      res.json({ result: 'error', message: 'Token invalid.' });
      return;
    }
    req.currentUser = user;
    next();
  } catch (e) {
    res.status(500);
    res.json({ result: 'error', message: 'Token invalid.' });
  }
}

exports.checkAuth = checkAuth;
