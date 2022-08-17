const { checkAndRefreshUserToken } = require('../lib/checkAndRefreshUserToken');

async function userInfo(req, res) {
  const result = await checkAndRefreshUserToken(req.currentUser);
  if (!result) {
    res.status(401);
    res.json({ result: 'error', message: 'Session expired.' });
    return;
  }
  res.status(200);
  res.json({ name: req.currentUser.name });
}

exports.userInfo = userInfo;
