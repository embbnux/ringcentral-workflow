const fetch = require('node-fetch');

module.exports = {
  id: 'webhook',
  name: 'Send HTTP request',
  type: 'External',
  params: [
    {
      id: 'url',
      name: 'URL',
      type: 'string',
      validator: 'https?://.+',
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
      id: 'format',
      name: 'Content-type',
      type: 'option',
      options: [{
        value: 'json',
        name: 'application/json',
      }, {
        value: 'form-url-encoded',
        name: 'application/x-www-form-urlencoded',
      },
      {
        value: 'text',
        name: 'text/plain',
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
    const contentTypeMap = {
      'json': 'application/json',
      'form-url-encoded': 'application/x-www-form-urlencoded',
      'text': 'text/plain',
    };
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': contentTypeMap[params.format] || contentTypeMap.json,
        ...params.headers,
      };
      const response = await fetch(
        params.url, {
          method: params.method,
          body: params.body,
          headers,
        },
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
