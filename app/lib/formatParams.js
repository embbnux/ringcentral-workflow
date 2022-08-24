const stringTemplate = require('string-template');

function formatParams(params, inputs) {
  const formattedParams = {};
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === 'string') {
      formattedParams[key] = stringTemplate(params[key], inputs);
    } else if (Array.isArray(params[key])) {
      formattedParams[key] = params[key].map(item => {
        if (typeof item === 'string') {
          return stringTemplate(item, inputs);
        }
        if (typeof item === 'object') {
          return formatParams(item, inputs);
        }
        return item;
      });
    } else if (typeof params[key] === 'object') {
      formattedParams[key] = formatParams(params[key], inputs);
    } else {
      formattedParams[key] = params[key];
    }
  });
  return formattedParams;
}

exports.formatParams = formatParams;