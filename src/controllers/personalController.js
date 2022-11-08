const { datos } = require("../data/datos.js");

const controller = {
  list: (req, res) => {
    res.render("./staff/personal", { listado: datos.personal });
  },
  detail: (req, res) => {
    const id = req.params.id;
    const resultados = datos.personal.filter((persona) => persona.id == id);

    if (resultados.length === 0) {
      return res.status(404).send(`No se encontro a nadie con el id ${id}`);
    }

    res.send(resultados);
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search;

    const results = [];

    for (let i = 0; i < datos.personal.length; i++) {
      if (
        datos.personal[i].nombre
          .toLocaleLowerCase()
          .includes(loQueBuscoElUsuario.toLocaleLowerCase())
      ) {
        results.push(datos.personal[i].nombre);
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
    res.redirect("/personal");
  },
  save: (req, res) => {},
  edit: (req, res) => {
    let id = req.params.id;
    let PersonalToEdit = datos.personal.filter((persona) => persona.id == id);
    console.log(id);
    console.log(PersonalToEdit);
    console.log(PersonalToEdit[0].nombre);
    res.render("./staff/edit", { PersonalToEdit: PersonalToEdit[0] });
  },
  update: (req, res) => {
    res.send("ok")
  },
  delete: (req, res) => {
    res.send("me eliminaste")
  }
};

module.exports = controller;
