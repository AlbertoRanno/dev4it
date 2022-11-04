const { datos } = require("../data/datos.js")

const controller = {
  listado: (req, res) => {
    res.render("proyects", {listado:datos.proyectos})
  }
}

module.exports = controller