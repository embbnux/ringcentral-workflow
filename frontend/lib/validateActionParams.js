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

export function validateActionParams({
  action,
  paramValues,
  sampleInputs,
}) {
  const errors = [];
  const params = action.params;
  const testParamValues = formatParams(paramValues, sampleInputs);
  for (const param of params) {
    const paramValue = paramValues[param.id];
    const testParamValue = testParamValues[param.id];
    if (paramValue === undefined || paramValue === null || paramValue === '') {
      errors.push({
        message: `Action param ${param.name} is required.`,
      });
      continue;
    }
    if (
      (param.type === 'string' || param.type === 'text') &&
      testParamValue.trim().length === 0
    ) {
      errors.push({
        message: `Action param ${param.name} is required.`,
      });
      continue;
    }
    if (param.limitLength && testParamValue.length > param.limitLength) {
      errors.push({
        message: `Action param ${param.name} length must be less than ${param.limitLength}.`,
      });
      continue;
    }
    if (param.validator) {
      const reg = new RegExp(param.validator);
      if (!reg.test(testParamValue)) {
        errors.push({
          message: `Action param ${param.name} is invalid.`,
        });
        continue;
      }
    }
    if (param.type === 'json') {
      try {
        JSON.parse(testParamValue);
      } catch (e) {
        errors.push({
          message: `Action param ${param.name} is invalid json type.`,
        });
        continue;
      }
    }
    if (param.type === 'keyValue') {
      if (typeof testParamValue !== 'object') {
        errors.push({
          message: `Action param ${param.name} is invalid keyValue type.`,
        });
        Object.keys(testParamValue).forEach((key) => {
          if (typeof key !== 'string') {
            errors.push({
              message: `Action param ${param.name} is invalid keyValue type.`,
            });
          }
          if (typeof testParamValue[key] !== 'string') {
            errors.push({
              message: `Action param ${param.name} is invalid keyValue type.`,
            });
          }
        });
        continue;
      }
    }
    if (param.type === 'array') {
      if (!Array.isArray(testParamValue)) {
        errors.push({
          message: `Action param ${param.name} is invalid array type.`,
        });
        continue;
      }
      if (param.limitLength && testParamValue.length > param.limitLength) {
        errors.push({
          message: `Action param ${param.name} length must be less than ${param.limitLength}.`,
        });
        continue;
      }
      if (param.required && testParamValue.length === 0) {
        errors.push({
          message: `Action param ${param.name} is required.`,
        });
        continue;
      }
      testParamValue.forEach((testItemParam) => {
        if (param.itemType === 'string') {
          if (typeof testItemParam !== 'string') {
            errors.push({
              message: `Action param ${param.name} is invalid.`,
            });
          }
        }
        if (param.itemType === 'object') {
          param.itemProperties.forEach((itemProperty) => {
            if (typeof testItemParam[itemProperty.id] !== itemProperty.type) {
              errors.push({
                message: `Action param ${param.name} is invalid.`,
              });
            }
            if (itemProperty.validator) {
              const reg = new RegExp(itemProperty.validator);
              if (!reg.test(testItemParam[itemProperty.id])) {
                errors.push({
                  message: `Action param ${param.name} is invalid.`,
                });
              }
            }
          });
        }
      });
    }
  }
  return errors;
}
