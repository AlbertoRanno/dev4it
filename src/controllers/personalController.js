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
};

module.exports = controller;
