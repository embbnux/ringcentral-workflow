const { RingCentral } = require('../../lib/ringcentral');
const { RINGCENTRAL_OPTIONS } = require('../../lib/constants');
const { checkAndRefreshUserToken } = require('../../lib/checkAndRefreshUserToken');

module.exports = {
  id: 'sendSMS',
  name: 'Send SMS',
  type: 'RC',
  params: [
    {
      id: 'messageText',
      name: 'Message Text',
      type: 'text',
    },
    {
      id: 'toPhoneNumber',
      name: 'To Phone Number',
      type: 'string',
    },
    {
      id: 'fromPhoneNumber',
      name: ' From Phone Number',
      type: 'option',
      options: [],
    },
  ],
  shouldFetchOptions: true,
  returnData: [
    {
      name: 'success',
      type: 'boolean',
    },
  ],
  getParamsOptions: async () => {
    
  },
  action: async ({
    user,
    params,
  }) => {
    const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
    try {
      const authResult = await checkAndRefreshUserToken(user);
      if (!authResult) {
        return {
          success: false,
        };
      }
      await rcSDK.request({
        path: '/restapi/v1.0/account/~/extension/~/sms',
        method: 'POST',
        body: {
          text: params.messageText,
          from: {
            phoneNumber: params.fromPhoneNumber,
          },
          to: [{
            phoneNumber: params.toPhoneNumber,
          }],
        },
      }, user.token);
      return {
        success: true,
      }
    } catch (e) {
      console.error(e);
      return {
        success: false,
      }
    }
  },
};
