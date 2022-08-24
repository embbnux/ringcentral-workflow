const { CONDITIONS  } = require('./conditions');
const { ACTIONS } = require('./actions');
const stringTemplate = require('string-template');

function runConditionNode({
  conditionNode,
  inputs,
}) {
  const condition = CONDITIONS.find(c => c.id === conditionNode.data.rule.condition);
  const input = inputs[conditionNode.data.rule.input];
  const value = conditionNode.data.rule.value;
  const conditionResult = condition.handler(input, value);
  return conditionResult;
}

function formatParams(params, inputs) {
  const formattedParams = {};
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === 'string') {
      formattedParams[key] = stringTemplate(params[key], inputs);
    } else if (typeof params[key] === 'object') {
      formattedParams[key] = formatParams(params[key], inputs);
    } else {
      formattedParams[key] = params[key];
    }
  });
  return formattedParams;
}

function runActionNode({
  user,
  actionNode,
  inputs,
}) {
  const action = ACTIONS.find(a => a.id === actionNode.data.type);
  const params = formatParams(actionNode.data.paramValues, inputs);
  return action.handler({
    user,
    params,
  });
};

async function runNode({
  user,
  node,
  inputs,
  deep,
  nodes,
}) {
  if (deep > 20) {
    return;
  }
  if (node.type === 'condition') {
    const conditionResult = await runConditionNode({
      conditionNode: node,
      inputs,
    });
    if (conditionResult) {
      for (const nextNodeId of node.data.nextNodes) {
        const nextNode = nodes.find((node) => node.id === nextNodeId);
        await runNode({
          user,
          node: nextNode,
          inputs: inputs,
          deep: deep + 1,
          nodes,
        });
      }
    } else if (node.data.enableFalsy) {
      for (const nextNodeId of node.data.falsyNodes) {
        const nextNode = nodes.find((node) => node.id === nextNodeId);
        await runNode({
          user,
          node: nextNode,
          inputs: inputs,
          deep: deep + 1,
          nodes,
        });
      }
    }
  }
  if (node.type === 'action') {
    await runActionNode({
      user,
      actionNode: node,
      inputs,
    });
  }
}

async function runFlow({
  user,
  inputs,
  flow,
}) {
  try {
    const triggerNode = flow.nodes.find((node) => node.type === 'trigger');
    for (const nextNodeId of triggerNode.data.nextNodes) {
      const nextNode = flow.nodes.find((node) => node.id === nextNodeId);
      await runNode({
        user,
        node: nextNode,
        inputs: inputs,
        deep: 1,
        nodes: flow.nodes,
      });
    }
  } catch (e) {
    console.error(`Run flow ${flow.id} failed`, e);
  }
}

exports.runFlow = runFlow;
