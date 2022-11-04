const { datos } = require("../data/datos.js");

const controller = {
  list: (req, res) => {
    res.render("./staff/personal", { listado: datos.personal });
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search

    const results = []

    for (let i=0; i<datos.personal.length; i++){
      if((datos.personal[i].nombre).toLocaleLowerCase().includes(loQueBuscoElUsuario.toLocaleLowerCase())){
        results.push(datos.personal[i].nombre)
      }
    }

    res.render("./staff/search", {loQueBuscoElUsuario, results})
  }
};

module.exports = controller;
