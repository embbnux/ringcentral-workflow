const { Flow } = require('../models/flow');

async function getFlow(req, res, next) {
  try {
    const flow = await Flow.findByPk(req.params.id);
    if (!flow || flow.userId !== req.currentUser.id) {
      res.status(404);
      res.json({ result: 'error', message: 'Not found.' });
      return;
    }
    req.currentFlow = flow;
    next();
  } catch (e) {
    console.error(e);
    res.status(500);
    res.json({ result: 'error', message: 'Internal server error' });
  }
}

exports.getFlow = getFlow;
