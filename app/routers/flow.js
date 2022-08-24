const { nanoid } = require('nanoid');
const { RingCentral } = require('../lib/ringcentral');
const { RINGCENTRAL_OPTIONS, APP_SERVER } = require('../lib/constants');
const { Flow } = require('../models/Flow');
const { Webhook } = require('../models/Webhook');
const { TRIGGERS } = require('../flow/triggers');
const { checkAndRefreshUserToken } = require('../lib/checkAndRefreshUserToken');
const { validateFlow, checkFlowIsCompleted } = require('../flow/validateFlow');

async function getFlows(req, res) {
  try {
    const flows = await Flow.findAll({
      where: {
        userId: req.currentUser.id,
      },
      limit: 20,
    });
    res.status(200);
    res.json(flows.map((flow) => ({
      id: flow.id,
      name: flow.name,
      enabled: flow.enabled,
    })));
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

async function createFlow(req, res) {
  try {
    const validateResult = validateFlow({
      nodes: req.body.nodes,
    });
    if (validateResult.errors.length > 0) {
      res.status(400);
      res.json({
        result: 'error',
        message: 'Flow validation failed',
        errors: validateResult.errors,
      });
      return;
    }
    const allFlows = await Flow.findAll({
      where: {
        userId: req.currentUser.id,
      }
    });
    if (allFlows.length > 10) {
      res.status(400);
      res.json({
        result: 'error',
        message: 'Every user can only create no more than 10 flows now.',
      });
      return;
    }
    const flow = await Flow.create({
      id: nanoid(15),
      name: req.body.name,
      userId: req.currentUser.id,
      nodes: req.body.nodes,
      enabled: false,
    });
    res.status(200);
    res.json({
      id: flow.id,
      name: flow.name,
      nodes: flow.nodes,
      enabled: flow.enabled,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

function getFlow(req, res) {
  const flow = req.currentFlow;
  res.status(200);
  res.json({
    id: flow.id,
    name: flow.name,
    nodes: flow.nodes,
    enabled: flow.enabled,
  });
}

async function updateFlow(req, res) {
  try {
    const flow = req.currentFlow;
    if (flow.enabled) {
      res.status(400);
      res.json({ result: 'error', message: 'Cannot update an enabled flow' });
      return;
    }
    const validateResult = validateFlow({
      nodes: req.body.nodes,
    });
    if (validateResult.errors.length > 0) {
      res.status(400);
      res.json({
        result: 'error',
        message: 'Flow validation failed',
        errors: validateResult.errors,
      });
      return;
    }
    flow.nodes = req.body.nodes;
    await flow.save();
    res.status(200);
    res.json({
      id: flow.id,
      name: flow.name,
      nodes: flow.nodes,
      enabled: flow.enabled,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

async function deleteFlow(req, res) {
  try {
    const flow = req.currentFlow;
    if (flow.enabled) {
      res.status(400);
      res.json({ result: 'error', message: 'Cannot delete an enabled flow.' });
      return;
    }
    await flow.destroy();
    res.status(200);
    res.json({
      id: flow.id,
      name: flow.name,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

async function toggleFlow(req, res) {
  try {
    const user = req.currentUser;
    const authResult = await checkAndRefreshUserToken(user);
    if (!authResult) {
      res.status(401);
      res.json({ result: 'error', message: 'Session expired.' });
      return;
    }
    const flow = req.currentFlow;
    if (req.body.enabled) {
      const isComplete = await checkFlowIsCompleted({ nodes: flow.nodes });
      if (!isComplete) {
        res.status(400);
        res.json({ result: 'error', message: 'Flow is not complete.' });
        return;
      }
    }
    flow.enabled = req.body.enabled;
    await flow.save();
    const enabledFlows = await Flow.findAll({
      where: {
        enabled: true,
        userId: req.currentUser.id,
      },
    });
    const eventFilterMap = {};
    enabledFlows.forEach((enabledFlow) => {
      const triggerNode = enabledFlow.nodes.find((node) => node.type === 'trigger');
      const triggerType = triggerNode.data.type;
      const trigger = TRIGGERS.find((trigger) => trigger.id === triggerType);
      if (trigger.type === 'RC') {
        eventFilterMap[trigger.eventFilter] = 1;
      }
    });
    const eventFilters = Object.keys(eventFilterMap);
    let webhook = await Webhook.findOne({
      where: {
        userId: req.currentUser.id,
        type: 'RC',
      }
    });
    const rcSDK = new RingCentral(RINGCENTRAL_OPTIONS);
    if (eventFilters.length === 0) {
      if (webhook && webhook.subscription) {
        await rcSDK.request({
          method: 'DELETE',
          path: `/restapi/v1.0/subscription/${webhook.subscription.id}`,
        }, user.token);
        webhook.subscription = null;
        await webhook.save();
      }
    } else {
      if (!webhook) {
        webhook = await Webhook.create({
          id: nanoid(15),
          userId: user.id,
          type: 'RC',
          subscription: null,
        });
      }
      if (!webhook.subscription) {
        const response = await rcSDK.request({
          method: 'POST',
          path: '/restapi/v1.0/subscription',
          body: {
            eventFilters,
            deliveryMode: {
              transportType: 'WebHook',
              address: `${APP_SERVER}/webhooks/${webhook.id}`,
            },
            expiresIn: 315360000,
          }
        }, user.token);
        const subscription = await response.json();
        webhook.subscription = subscription;
        webhook.expiredAt = new Date(subscription.expirationTime);
        await webhook.save();
      } else {
        const response = await rcSDK.request({
          method: 'PUT',
          path: `/restapi/v1.0/subscription/${webhook.subscription.id}`,
          body: {
            eventFilters,
            deliveryMode: {
              transportType: 'WebHook',
              address: `${APP_SERVER}/webhooks/${webhook.id}`,
            },
            expiresIn: 315360000,
          }
        }, user.token);
        const subscription = await response.json();
        webhook.subscription = subscription;
        webhook.expiredAt = new Date(subscription.expirationTime);
        await webhook.save();
      }
    }
    res.status(200);
    res.json({
      id: flow.id,
      name: flow.name,
      enabled: flow.enabled,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

exports.getFlows = getFlows;
exports.updateFlow = updateFlow;
exports.getFlow = getFlow;
exports.createFlow = createFlow;
exports.deleteFlow = deleteFlow;
exports.toggleFlow = toggleFlow;
