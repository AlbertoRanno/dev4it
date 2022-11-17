const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal");

function userLogged(req, res, next) {
  res.locals.isLogged = false;

  let emailInCookie = req.cookies.userEmail;
  let usersFromCookie = personalModel.filtrarPorCampoValor(
    "email",
    emailInCookie
  );
  let userFromCookie = usersFromCookie[0];
  //console.log(userFromCookie);

  if (userFromCookie) {
    req.session.userLogged = userFromCookie;
  }

  if (req.session && req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged;
  }

  next();
}

module.exports = userLogged;

  