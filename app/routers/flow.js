const { nanoid } = require('nanoid');
const { Flow } = require('../models/Flow');

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
    // TODO: validate nodes
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
    // TODO: validate nodes
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
    const flow = req.currentFlow;
    // TODO: validate nodes
    // TODO: setup trigger to enable flow
    flow.enabled = req.body.enabled;
    await flow.save();
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
