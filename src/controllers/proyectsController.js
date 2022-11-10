const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal")
const proyectsModel = new JsonModel("proyects");
const { validationResult } = require("express-validator");

let datos = proyectsModel.readJsonFile();
let datosPersonal = personalModel.readJsonFile()

const controller = {
  list: (req, res) => {
    res.render("./proyects/proyects", { listado: datos });
  },
  detail: (req, res) => {
    const id = req.params.id;
    const proyect = proyectsModel.buscar(id)

    if (!proyect) {
      return res
        .status(404)
        .send(`No se encontro ningun proyecto con el id ${id}`);
    }

    res.send(proyect);
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search;

    const results = [];

    for (let i = 0; i < datos.length; i++) {
      if (
        datos[i].nombre
          .toLocaleLowerCase()
          .includes(loQueBuscoElUsuario.toLocaleLowerCase())
      ) {
        results.push(datos[i].nombre);
      }
    }

    res.render("./staff/search", { loQueBuscoElUsuario, results });
  },
  register: (req, res) => {
    res.render("./proyects/register.ejs", { personal: datosPersonal });
  },
  store: (req, res) => {
    res.send("store pendiente");
    ////res.redirect("/proyectos");
  }
};

module.exports = controller