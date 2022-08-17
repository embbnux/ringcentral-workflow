const RINGCENTRAL_OPTIONS = {
  server: process.env.RINGCENTRAL_SERVER,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  redirectUri: `${process.env.APP_SERVER}/oauth/callback`,
};

exports.RINGCENTRAL_OPTIONS = RINGCENTRAL_OPTIONS;
exports.APP_SERVER = process.env.APP_SERVER;
