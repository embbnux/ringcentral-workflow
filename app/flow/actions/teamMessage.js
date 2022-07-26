const { RingCentral } = require('../../lib/ringcentral');
const { RINGCENTRAL_OPTIONS } = require('../../lib/constants');
const { checkAndRefreshUserToken } = require('../../lib/checkAndRefreshUserToken');

module.exports = {
  id: 'sendTeamMessage',
  name: 'Send message',
  type: 'RC',
  params: [
    {
      id: 'messageText',
      name: 'Message Text',
      type: 'text',
      limitLength: 500,
    },
    {
      id: 'conversationId',
      name: 'Conversation ID',
      type: 'string',
      validator: '^[0-9]+$',
    },
  ],
  returnData: [
    {
      name: 'success',
      type: 'boolean',
    },
  ],
  handler: async ({
    user,
    params,
  }) => {
    const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
    const chatId = params.conversationId;
    try {
      const authResult = await checkAndRefreshUserToken(user);
      if (!authResult) {
        return {
          success: false,
        };
      }
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
