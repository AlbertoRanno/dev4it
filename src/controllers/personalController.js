const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal");
const proyectsModel = new JsonModel("proyects");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

let datos = personalModel.readJsonFile();
let datosProyectos = proyectsModel.readJsonFile();

const controller = {
  list: (req, res) => {
    res.render("./staff/personal", {
      listado: datos,
    });
  },
  detail: (req, res) => {
    let id = req.params.id;
    let persona = personalModel.buscar(id);

    if (!persona) {
      return res.status(404).send(`No se encontro a nadie con el id ${id}`);
    }

    res.render("./staff/detail", { persona });
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search.toLocaleLowerCase();

    const results = [];

    for (let i = 0; i < datos.length; i++) {
      if (datos[i].name.toLocaleLowerCase().includes(loQueBuscoElUsuario)) {
        results.push(datos[i]);
      }
    }

    res.render("./staff/search", {
      loQueBuscoElUsuario,
      results,
    });
  },
  register: (req, res) => {
    res.render("./staff/register", {
      datosProyectos,
    });
  },
  store: (req, res) => {
    const resultValidation = validationResult(req);

    //Verifico que no haya sido cargado previamente:
    let userInDB = personalModel.filtrarPorCampoValor("email", req.body.email);

    if (userInDB.length >= 1) {
      res.render("./staff/register", {
        errors: {
          email: {
            msg: "Ya existe un usuario registrado con este email",
          },
        },
        oldData: req.body,
        datosProyectos,
      });
    } else if (resultValidation.isEmpty()) {
      (req.body.password = bcryptjs.hashSync(req.body.password, 10)),
        (req.body.avatar = "/images/avatars/" + req.file.filename);
      delete req.body.repeatPassword;

      console.log(req.body);

      let updatedUserId = personalModel.save(req.body);

      res.redirect("/personal/detail/" + updatedUserId);
    } else {
      res.render("./staff/register", {
        errors: resultValidation.mapped(),
        oldData: req.body,
        datosProyectos,
      });
    }
  },
  login: (req, res) => {
    res.render("./staff/login");
  },
  access: (req, res) => {
    let usersToLogin = personalModel.filtrarPorCampoValor(
      "email",
      req.body.email
    );
    let userToLogin = usersToLogin[0];

    if (userToLogin) {
      let isOkThePassword = bcryptjs.compareSync(
        req.body.password,
        userToLogin.password
      );
      if (isOkThePassword) {
        //si email y password OK, guardo al usuario en session. Pero antes, por seguridad, elimino el Password
        delete userToLogin.password;
        req.session.userLogged = userToLogin;
        //console.log(req.session);

        if (req.body.rememberUser) {
          //si vino la casilla tildada, seteo una nueva cookie, guardando asi el email en el cliente
          res.cookie("userEmail", req.body.email, {
            maxAge: 1000 * 60 * 60 * 24,
          });
        }

        res.redirect("./profile/" + userToLogin.id);
      } else {
        res.render("./staff/login", {
          errors: { email: { msg: "Credenciales inválidas" } },
        });
      }
    } else {
      res.render("./staff/login", {
        errors: { email: { msg: "Usuario no encontrado en la base de datos" } },
      });
    }
  },
  profile: (req, res) => {
    res.render("./staff/profile", { user: req.session.userLogged });
  },
  logout: (req, res) => {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },
  edit: (req, res) => {
    let id = req.params.id;
    let personalToEdit = personalModel.buscar(id);
    res.render("./staff/edit", {
      personalToEdit,
      datosProyectos,
    });
  },
  update: (req, res) => {
    const resultValidation = validationResult(req);
    let userToModify = personalModel.buscar(req.params.id);

    console.log(typeof userToModify.proyects);

    if (resultValidation.isEmpty()) {
      req.body.id = userToModify.id;
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
      delete req.body.repeatPassword;
      if (!req.file) {
        console.log(
          "No se editó la imagen. Traigo la que tenía en base de datos"
        );
        req.body.avatar = userToModify.avatar;
      } else {
        console.log("Se editó la imagen. Subo la nueva.");
        req.body.avatar = "/images/avatars/" + req.file.filename;
      }

      console.log(req.body);

      personalModel.update(req.body);

      res.redirect("/personal/detail/" + req.params.id);
    } else {
      res.render("./staff/edit", {
        errors: resultValidation.mapped(),
        oldData: req.body,
        datosProyectos,
        personalToEdit: userToModify,
      });
    }
  },
  delete: (req, res) => {
    let id = req.params.id;
    personalModel.destroy(id);

    res.redirect("/personal");
  },
};

module.exports = controller;
