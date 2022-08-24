
const { CONDITIONS  } = require('./conditions');
const { ACTIONS } = require('./actions');
const { TRIGGERS } = require('./triggers');
const { formatParams } = require('../lib/formatParams');

function validateConditionNode({
  node,
  errors,
  triggerOutput,
}) {
  const condition = CONDITIONS.find(c => c.id === node.data.rule.condition);
  if (!condition) {
    errors.push({
      nodeName: node.data.label,
      message: 'Condition rule not found.',
    });
    return;
  }
  const input = triggerOutput.find(i => i.id === node.data.rule.input);
  if (!input) {
    errors.push({
      nodeName: node.data.label,
      message: 'Condition input not found.',
    });
    return;
  }
  const inputType = input.type;
  if (condition.supportTypes.indexOf(inputType) === -1) {
    errors.push({
      nodeName: node.data.label,
      message: `Condition rule not support ${inputType} type.`,
    });
    return;
  }
  const value = node.data.rule.value;
  if (condition.supportTypes.indexOf(typeof value) === -1) {
    errors.push({
      nodeName: node.data.label,
      message: `Condition rule not support ${inputType} type.`,
    });
  }
  if (!node.data.enableFalsy && node.data.falsyNodes && node.data.falsyNodes.length > 0) {
    errors.push({
      nodeName: node.data.label,
      message: 'Falsy nodes must be removed.',
    });
  }
}

function validateActionNode({
  node,
  errors,
  triggerSampleData,
}) {
  const action = ACTIONS.find(a => a.id === node.data.type);
  if (!action) {
    errors.push({
      nodeName: node.data.label,
      message: 'Action type not found.',
    });
    return;
  }
  const paramValues = node.data.paramValues;
  const params = action.params;
  const testParamValues = formatParams(paramValues, triggerSampleData);
  for (const param of params) {
    const paramValue = paramValues[param.id];
    const testParamValue = testParamValues[param.id];
    if (paramValue === undefined || paramValue === null) {
      errors.push({
        nodeName: node.data.label,
        message: `Action param ${param.name} is required.`,
      });
      continue;
    }
    if (
      (param.type === 'string' || param.type === 'text') &&
      (
        testParamValue.length === 0 ||
        testParamValue.trim().length === 0
      )
    ) {
      errors.push({
        nodeName: node.data.label,
        message: `Action param ${param.name} is required.`,
      });
      continue;
    }
    if (param.limitLength && testParamValue.length > param.limitLength) {
      errors.push({
        nodeName: node.data.label,
        message: `Action param ${param.name} length must be less than ${param.limitLength}.`,
      });
      continue;
    }
    // TODO: validate remote option
    if (param.type === 'option' && !param.remote) {
      const option = param.options.find(o => o.value === paramValue);
      if (!option) {
        errors.push({
          nodeName: node.data.label,
          message: `Action param ${param.name} is invalid.`,
        });
        continue;
      }
    }
    if (param.validator) {
      const reg = new RegExp(param.validator);
      if (!reg.test(testParamValue)) {
        errors.push({
          nodeName: node.data.label,
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
          nodeName: node.data.label,
          message: `Action param ${param.name} is invalid json type.`,
        });
        continue;
      }
    }
    if (param.type === 'keyValue') {
      if (typeof testParamValue !== 'object') {
        errors.push({
          nodeName: node.data.label,
          message: `Action param ${param.name} is invalid keyValue type.`,
        });
        Object.keys(testParamValue).forEach((key) => {
          if (typeof key !== 'string') {
            errors.push({
              nodeName: node.data.label,
              message: `Action param ${param.name} is invalid keyValue type.`,
            });
          }
          if (typeof testParamValue[key] !== 'string') {
            errors.push({
              nodeName: node.data.label,
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
          nodeName: node.data.label,
          message: `Action param ${param.name} is invalid array type.`,
        });
        continue;
      }
      if (param.limitLength && testParamValue.length > param.limitLength) {
        errors.push({
          nodeName: node.data.label,
          message: `Action param ${param.name} length must be less than ${param.limitLength}.`,
        });
        continue;
      }
      if (param.required && testParamValue.length === 0) {
        errors.push({
          nodeName: node.data.label,
          message: `Action param ${param.name} is required.`,
        });
        continue;
      }
      testParamValue.forEach((testItemParam) => {
        if (param.itemType === 'string') {
          if (typeof testItemParam !== 'string') {
            errors.push({
              nodeName: node.data.label,
              message: `Action param ${param.name} is invalid.`,
            });
          }
        }
        if (param.itemType === 'object') {
          param.itemProperties.forEach((itemProperty) => {
            if (typeof testItemParam[itemProperty.id] !== itemProperty.type) {
              errors.push({
                nodeName: node.data.label,
                message: `Action param ${param.name} is invalid.`,
              });
            }
            if (itemProperty.validator) {
              const reg = new RegExp(itemProperty.validator);
              if (!reg.test(testItemParam[itemProperty.id])) {
                errors.push({
                  nodeName: node.data.label,
                  message: `Action param ${param.name} is invalid.`,
                });
              }
            }
          });
        }
      });
    }
  }
}

function validateNode({ nodes, node, errors, deep, triggerOutput, triggerSampleData }) {
  if (deep > 10) {
    errors.push({
      message: 'Flow is too deep, max 10 levels',
    });
    return;
  }
  if (!node.data) {
    errors.push({
      message: 'Node is invalid.',
    });
    return;
  }
  if (node.type === 'condition') {
    validateConditionNode({
      node,
      errors,
      triggerOutput,
    });
    if (!Array.isArray(node.data.nextNodes)) {
      errors.push({
        nodeName: node.data.label,
        message: 'Condition node must have next nodes',
      });
      return;
    }
    for (const nextNodeId of node.data.nextNodes) {
      const nextNode = nodes.find((node) => node.id === nextNodeId);
      validateNode({
        node: nextNode,
        errors,
        deep: deep + 1,
        nodes,
        triggerOutput,
        triggerSampleData,
      });
    }
    if (node.data.enableFalsy) {
      if (!Array.isArray(node.data.falsyNodes)) {
        errors.push({
          nodeName: node.data.label,
          message: 'Condition node must have next falsy nodes',
        });
        return;
      }
      for (const nextNodeId of node.data.falsyNodes) {
        const nextNode = nodes.find((node) => node.id === nextNodeId);
        validateNode({
          node: nextNode,
          errors,
          deep: deep + 1,
          nodes,
          triggerOutput,
          triggerSampleData,
        });
      }
    }
  }
  if (node.type === 'action') {
    validateActionNode({
      node,
      errors,
      triggerSampleData,
    });
  }
}

function validateFlow({
  nodes,
}) {
  const errors = [];
  if (!nodes || nodes.length === 0) {
    errors.push({
      message: 'Flow must have at least one node',
    });
    return errors;
  }
  const triggerNode = nodes.find((node) => node.type === 'trigger');
  if (!triggerNode || !triggerNode.data) {
    error.push({
      message: 'Flow must have a trigger node',
    });
  }
  const trigger = TRIGGERS.find(t => t.id === triggerNode.data.type);
  const triggerOutput = trigger.outputData;
  const triggerSampleData = {};
  triggerOutput.forEach((item) => {
    triggerSampleData[item.id] = item.testData;
  });
  let deep = 1;
  for (const nextNodeId of triggerNode.data.nextNodes) {
    const nextNode = nodes.find((node) => node.id === nextNodeId);
    validateNode({
      nodes,
      node: nextNode,
      errors,
      deep: deep + 1,
      triggerOutput,
      triggerSampleData,
    });
  }
  return {
    errors,
  };
}

function checkBlankAndActionNode({
  nodes,
  node,
  blankNodes,
  actionNodes,
}) {
  if (node.type === 'action') {
    actionNodes.push(node);
    return;
  }
  if (node.type === 'blank') {
    blankNodes.push(node);
    return;
  }
  for (const nextNodeId of node.data.nextNodes) {
    const nextNode = nodes.find((node) => node.id === nextNodeId);
    checkBlankAndActionNode({
      node: nextNode,
      nodes,
      blankNodes,
      actionNodes,
    });
  }
  if (node.type === 'conditon' && node.data.enableFalsy) {
    for (const nextNodeId of node.data.falsyNodes) {
      const nextNode = nodes.find((node) => node.id === nextNodeId);
      checkBlankAndActionNode({
        node: nextNode,
        nodes,
        blankNodes,
        actionNodes,
      });
    }
  }
}

function checkFlowIsCompleted({
  nodes,
}) {
  const blankNodes = [];
  const actionNodes = []
  const triggerNode = nodes.find((node) => node.type === 'trigger');
  for (const nextNodeId of triggerNode.data.nextNodes) {
    const nextNode = nodes.find((node) => node.id === nextNodeId);
    checkBlankAndActionNode({
      blankNodes,
      actionNodes,
      nodes,
      node: nextNode,
    })
  }
  if (blankNodes.length > 0) {
    return false;
  }
  return actionNodes.length > 0;
}

exports.validateFlow = validateFlow;
exports.checkFlowIsCompleted = checkFlowIsCompleted;
