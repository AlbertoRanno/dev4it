function userLogged(req, res, next) {
  if (req.session && req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged 
  }
  next();
}

module.exports = userLogged;
