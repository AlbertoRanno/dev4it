function auth(req, res, next) {
  if (!req.session.userLogged) {
    res.redirect("/personal/login")
  }
  next()
}

module.exports = auth