const fetch = require('node-fetch');

module.exports = {
  id: 'webhook',
  name: 'Send Webhook request',
  type: 'External',
  params: [
    {
      id: 'url',
      name: 'URL',
      type: 'string',
    },
    {
      id: 'method',
      name: 'Method',
      type: 'option',
      options: [{
        value: 'GET',
        name: 'GET',
      }, {
        value: 'POST',
        name: 'POST',
      }],
    },
    {
      id: 'body',
      name: 'Request Body',
      type: 'json',
    },
    {
      id: 'headers',
      name: 'Headers',
      type: 'keyValue',
      keyProperty: {
        id: 'key',
        type: 'string',
        name: 'Header Key',
      },
      valueProperty: {
        id: 'key',
        type: 'string',
        name: 'Header Value',
      }
    },
  ],
  returnData: [
    {
      name: 'success',
      type: 'boolean',
    },
  ],
  handler: async ({
    params,
  }) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      if (params.headerKey0) {
        headers[params.headerKey0] = params.headerValue0;
      }
      const response = await fetch(
        params.url, {
          method: params.method,
          body: params.body,
          headers,
        }
      );
      return {
        success: response.status < 400,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
      }
    }
  },
};
