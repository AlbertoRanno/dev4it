const { datos } = require("../data/datos.js")

const controller = {
  list: (req, res) => {
    res.render("./proyects/proyects", {listado:datos.proyectos})
  }
}

module.exports = controller