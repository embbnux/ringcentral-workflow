const { RingCentral } = require('../../lib/ringcentral');
const { RINGCENTRAL_OPTIONS } = require('../lib/constants');

module.exports = {
  id: 'sendTeamMessage',
  name: 'Send Team Message',
  type: 'RC',
  params: [
    {
      name: 'messageText',
      type: 'string',
    },
    {
      name: 'conversationId',
      type: 'string',
    },
  ],
  returnData: [
    {
      name: 'success',
      type: 'boolean',
    },
  ],
  action: ({
    user,
    params,
  }) => {
    const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
    const chatId = params.conversationId;
    try {
      await rcSDK.request({
        path: `/restapi/v1.0/glip/chats/${chatId}/posts`,
        method: 'POST',
        body: {
          text: params.messageText,
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
