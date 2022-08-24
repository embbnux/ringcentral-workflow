const { RingCentral } = require('../lib/ringcentral');
const { User } = require('../models/user');
const { encodeJwt } = require('../lib/jwt');
const { RINGCENTRAL_OPTIONS } = require('../lib/constants');

function authorize(req, res) {
  const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
  res.redirect(rcSDK.loginUrl({
    state: req.query.state,
  }));
}

async function authCallBack(req, res) {
  const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
  if (req.query.error || !req.query.code) {
    res.redirect('/');
    return;
  }
  try {
    const token = await rcSDK.generateToken({
      code: req.query.code,
    });
    const extensionInfoRes = await rcSDK.request({
      path: '/restapi/v1.0/account/~/extension/~',
      method: 'GET',
    }, token);
    const extensionInfo = await extensionInfoRes.json();
    const user = await User.findByPk(token.owner_id);
    if (!user) {
      await User.create({
        id: token.owner_id,
        accountId: extensionInfo.account.id,
        token,
        name: extensionInfo.name,
      });
    } else {
      user.token = token;
      user.name = extensionInfo.name;
      await user.save();
    }
    const jwtToken = encodeJwt({
      id: token.owner_id,
    });
    res.render('authCallback', {
      token: jwtToken,
    });
  } catch (e) {
    res.status(200);
    res.send(e.message);
  }
}

exports.authorize = authorize;
exports.authCallBack = authCallBack;
