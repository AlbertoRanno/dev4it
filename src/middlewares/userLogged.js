const Persona  = require("../models/Persona");

function userLogged(req, res, next) {
  res.locals.isLogged = false;

  let emailInCookie = req.cookies.userEmail;

  Persona.findOne(
    {
      email: emailInCookie,
    },
    (error, userFromCookie) => {
      if (error) {
        return res.status(500).json({ message: "Error buscando al usuario" });
      } else {
        if (userFromCookie) {
          req.session.userLogged = userFromCookie;
        }

        if (req.session && req.session.userLogged) {
          res.locals.isLogged = true;
          res.locals.userLogged = req.session.userLogged;
        }

        next();
      }
    }
  );
}

module.exports = userLogged;
