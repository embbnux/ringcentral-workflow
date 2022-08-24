const isEqual = {
  id: 'isEqual',
  name: 'is equal to',
  supportTypes: ['string'],
  valueType: 'string',
  handler: (input, value) => {
    return value === input;
  },
};

const isTrue = {
  id: 'isTrue',
  name: 'is equal to true',
  supportTypes: ['boolean'],
  valueType: null,
  handler: (input) => {
    return input === true;
  },
};

const isFalse = {
  id: 'isFalse',
  name: 'is equal to false',
  supportTypes: ['boolean'],
  valueType: null,
  handler: (input) => {
    return input === false;
  },
};

const isContains = {
  id: 'isContains',
  name: 'contains',
  supportTypes: ['string'],
  valueType: 'string',
  handler: (input, value) => {
    return input.indexOf(value) > -1;
  },
};

const isNotContains = {
  id: 'isNotContains',
  name: 'does not contains',
  valueType: 'string',
  supportTypes: ['string'],
  handler: (input, value) => {
    return input.indexOf(value) === -1;
  },
};

const isBeforeDateTime = {
  id: 'isBeforeDateTime',
  name: 'is before date time',
  supportTypes: ['date', 'dateTime'],
  valueType: 'dateTime',
  handler: (input, value) => {
    const inputDate = new Date(input);
    const valueDate = new Date(value);
    return inputDate < valueDate;
  },
};

const isAfterDateTime = {
  id: 'isAfterDateTime',
  name: 'is after date time',
  supportTypes: ['date', 'dateTime'],
  valueType: 'dateTime',
  handler: (input, value) => {
    const inputDate = new Date(input);
    const valueDate = new Date(value);
    return inputDate > valueDate;
  }
};

const CONDITIONS = [
  isEqual,
  isTrue,
  isFalse,
  isContains,
  isNotContains,
  isBeforeDateTime,
  isAfterDateTime,
];

exports.CONDITIONS = CONDITIONS;
