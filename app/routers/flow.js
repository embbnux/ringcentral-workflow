const { nanoid } = require('nanoid');
const { getUserFromToken } = require('../lib/getUserFromToken');
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

async function getFlow(req, res) {
  try {
    const flow = await Flow.findByPk(req.params.id);
    if (!flow || flow.userId !== req.currentUser.id) {
      res.status(404);
      res.json({ result: 'error', message: 'Not found.' });
      return;
    }
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
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

async function updateFlow(req, res) {
  try {
    const flow = await Flow.findByPk(req.params.id);
    if (!flow || flow.userId !== req.currentUser.id) {
      res.status(404);
      res.json({ result: 'error', message: 'Not found.' });
      return;
    }
    // TODO: validate nodes
    flow.nodes = req.body.nodes;
    await flow.save();
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

exports.getFlows = getFlows;
exports.updateFlow = updateFlow;
exports.getFlow = getFlow;
exports.createFlow = createFlow;
