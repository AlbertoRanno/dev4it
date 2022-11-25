const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal");
const proyectsModel = new JsonModel("proyects");
const { validationResult } = require("express-validator");

let datos = proyectsModel.readJsonFile();
let datosPersonal = personalModel.readJsonFile();
let estados = [
  "Activo",
  "Finalizado",
  "En elaboración de propuesta",
  "En espera de respuesta",
  "Pausado por el cliente",
  "Pausado por CDT",
  "En análisis",
  "Pausado",
];

const controller = {
  list: (req, res) => {
    res.render("./proyects/proyects", { listado: datos });
  },
  detail: (req, res) => {
    const id = req.params.id;
    const proyect = proyectsModel.buscar(id);

    if (!proyect) {
      return res
        .status(404)
        .send(`No se encontro ningun proyecto con el id ${id}`);
    }

    res.render("./proyects/detail", { proyect });
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search;

    const results = [];

    for (let i = 0; i < datos.length; i++) {
      if (
        datos[i].name
          .toLocaleLowerCase()
          .includes(loQueBuscoElUsuario.toLocaleLowerCase())
      ) {
        results.push(datos[i]);
      }
    }

    res.render("./proyects/search", { loQueBuscoElUsuario, results });
  },
  register: (req, res) => {
    res.render("./proyects/register.ejs", { personal: datosPersonal, estados });
  },
  store: (req, res) => {
    const resultValidation = validationResult(req);

    let proyectInDB = proyectsModel.filtrarPorCampoValor("name", req.body.name);

    if (proyectInDB.length >= 1) {
      res.render("./proyects/register", {
        errors: { name: { msg: "Este proyecto ya fue ingresado" } },
        oldData: req.body,
        estados,
        personal: datosPersonal,
      });
    } else if (resultValidation.isEmpty()) {
      console.log(req.body);

      let newProyectId = proyectsModel.save(req.body);

      res.redirect("/proyectos/detail/" + newProyectId);
    } else {
      res.render("./proyects/register", {
        personal: datosPersonal,
        estados,
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }
  },
  edit: (req, res) => {
    let id = req.params.id;
    let proyectToEdit = proyectsModel.buscar(id);
    let toAssign = [];
    for (let i = 0; i < datosPersonal.length; i++) {
      if (datosPersonal[i].rol != "Gestor de proyectos") {
        toAssign.push(datosPersonal[i]);
      }
    }

    console.log(proyectToEdit.involved);
    console.log(toAssign);

    res.render("./proyects/edit", {
      proyectToEdit,
      personal: datosPersonal,
      estados,
      toAssign,
    });
  },
  update: (req, res) => {},
  delete: (req, res) => {
    let id = req.params.id;
    proyectsModel.destroy(id);

    res.redirect("/proyectos");
  },
};

module.exports = controller;
