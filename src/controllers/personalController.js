const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

let datos = personalModel.readJsonFile();

const controller = {
  list: (req, res) => {
    res.render("./staff/personal", { listado: datos });
  },
  detail: (req, res) => {
    let id = req.params.id;
    let persona = personalModel.buscar(id);

    if (!persona) {
      return res.status(404).send(`No se encontro a nadie con el id ${id}`);
    }

    res.send(persona);
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search.toLocaleLowerCase();

    const results = [];

    for (let i = 0; i < datos.length; i++) {
      if (datos[i].name.toLocaleLowerCase().includes(loQueBuscoElUsuario)) {
        results.push(datos[i].name);
      }
    }

    res.render("./staff/search", { loQueBuscoElUsuario, results });
  },
  register: (req, res) => {
    res.render("./staff/register");
  },
  store: (req, res) => {
    const resultValidation = validationResult(req);

    //Verifico que no haya sido cargado previamente:
    let userInDB = personalModel.filtrarPorCampoValor("email", req.body.email);

    if (userInDB.length >= 1) {     
      res.render("./staff/register", {
        errors: {
          email: { msg: "Ya existe un usuario registrado con este email" }},
        oldData: req.body,        
      });
       
    } else if (resultValidation.isEmpty()) {
      (req.body.password = bcryptjs.hashSync(req.body.password, 10)),
        (req.body.avatar = "/images/avatars/" + req.file.filename);

      //bcryptjs.compareSync("contraseña", hash)
      console.log(req.body);

      let updatedUserId = personalModel.save(req.body);

      res.redirect("/personal/" + updatedUserId);
    } else {
      res.render("./staff/register", {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }
    //mapped() returns: an object where the keys are the field names, and the values are the validation errors
  },
  login: (req, res) => {
    res.render("./staff/login");
  },
  edit: (req, res) => {
    let id = req.params.id;
    let personalToEdit = personalModel.buscar(id);

    res.render("./staff/edit", { personalToEdit: personalToEdit });
  },
  update: (req, res) => {
    personalModel.update(req.body);
    console.log(req.body);
    res.redirect("/personal");
  },
  delete: (req, res) => {
    let id = req.params.id;
    personalModel.destroy(id);

    res.redirect("/personal");
  },
};

module.exports = controller;
