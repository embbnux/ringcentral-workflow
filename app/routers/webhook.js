function webhookTrigger(req, res) {
  if (req.headers.hasOwnProperty('validation-token')) {
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Validation-Token', req.headers['validation-token']);
    res.statusCode = 200;
    res.end();
    return;
  }
  console.log(req.body);
  res.json({
    result: 'success',
  });
}

exports.webhookTrigger = webhookTrigger;
