function guest(req, res, next) {
  if (req.session.userLogged) {
    res.redirect("/personal/profile/:id")
  }
  next()
}

module.exports = guest