const { TRIGGERS } = require('../flow/triggers');
const { CONDITIONS  } = require('../flow/conditions');
const { ACTIONS } = require('../flow/actions');

function getTriggers(req, res) {
  res.status(200);
  res.json(TRIGGERS.map((trigger) => ({
    id: trigger.id,
    name: trigger.name,
    type: trigger.type,
    outputData: trigger.outputData,
  })));
}

function getConditions(req, res) {
  res.status(200);
  res.json(CONDITIONS.map((condition) => ({
    id: condition.id,
    name: condition.name,
    supportTypes: condition.supportTypes,
    valueType: condition.valueType,
  })));
}

function getActions(req, res) {
  res.status(200);
  res.json(ACTIONS.map((action) => ({
    id: action.id,
    name: action.name,
    params: action.params,
    type: action.type,
    returnData: action.returnData,
  })));
}

exports.getTriggers = getTriggers;
exports.getConditions = getConditions;
exports.getActions = getActions;
