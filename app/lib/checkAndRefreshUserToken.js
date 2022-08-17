const { RingCentral } = require('./ringcentral');
const { RINGCENTRAL_OPTIONS } = require('./constants');

async function checkAndRefreshUserToken(user) {
  if (!user.token) {
    return false;
  }
  const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
  if (rcSDK.isAccessTokenValid(user.token)) {
    return true;
  }
  if (!rcSDK.isRefreshTokenValid(user.token)) {
    return false;
  }
  try {
    console.log('refreshing token');
    const newToken = await rcSDK.refreshToken(user.token);
    user.token = newToken;
    await user.save();
    console.log('refresh token success');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

exports.checkAndRefreshUserToken = checkAndRefreshUserToken;
