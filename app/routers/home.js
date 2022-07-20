function home(req, res) {
  res.render('home', {
    assetsPath: process.env.ASSETS_PATH,
  });
}

exports.home = home;
