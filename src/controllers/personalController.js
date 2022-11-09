const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal");

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
      if (datos[i].nombre.toLocaleLowerCase().includes(loQueBuscoElUsuario)) {
        results.push(datos[i].nombre);
      }
    }

    res.render("./staff/search", { loQueBuscoElUsuario, results });
  },
  register: (req, res) => {
    res.render("./staff/register");
  },
  store: (req, res) => {
    let newPersonal = {
      nombre: req.body.nombre,
      edad: req.body.edad,
      email: req.body.email,
    };
    res.send("ok")
    // fs.appendFileSync("src/data/data.json", JSON.stringify(newPersonal));
    //res.redirect("/personal");
  },
  edit: (req, res) => {
    let id = req.params.id;
    let personalToEdit = personalModel.buscar(id)

    res.render("./staff/edit", { personalToEdit: personalToEdit });
  },
  update: (req, res) => {
    res.send("ok");
  },
  delete: (req, res) => {
    res.send("me eliminaste");
  },
};

module.exports = controller;
