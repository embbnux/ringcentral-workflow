async function userInfo(req, res) {
  res.status(200);
  res.json({ name: req.currentUser.name });
}

exports.userInfo = userInfo;
