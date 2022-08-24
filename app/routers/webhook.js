const { Webhook } = require('../models/Webhook');
const { User } = require('../models/User');
const { Flow } = require('../models/Flow');
const { runFlow } = require('../flow/runFlow');
const { TRIGGERS } = require('../flow/triggers');

function triggerFlows(user, event, flows) {
  for (const flow of flows) {
    const triggerNode = flow.nodes.find((node) => node.type === 'trigger');
    const triggerType = triggerNode.data.type;
    const trigger = TRIGGERS.find((trigger) => trigger.id === triggerType);
    if (trigger.canHandle({ user, event })) {
      // TODO: use SQS to trigger and run flow
      // Current run flow is synchronous
      runFlow({
        user,
        inputs: trigger.dataHandler({ user, event }),
        flow,
      });
    }
  }
}

async function webhookTrigger(req, res) {
  if (req.headers.hasOwnProperty('validation-token')) {
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Validation-Token', req.headers['validation-token']);
    res.statusCode = 200;
    res.end();
    return;
  }
  console.log(req.body);
  const webhookId = req.params.id;
  try {
    const webhookRecord = await Webhook.findByPk(webhookId);
    if (webhookRecord) {
      const user = await User.findByPk(webhookRecord.userId);
      if (user) {
        const flows = await Flow.findAll({
          where: {
            userId: user.id,
            enabled: true,
          },
        });
        triggerFlows(user, req.body, flows);
      }
    }
  } catch (e) {
    console.error(e);
  }
  res.json({
    result: 'success',
  });
}

exports.webhookTrigger = webhookTrigger;
