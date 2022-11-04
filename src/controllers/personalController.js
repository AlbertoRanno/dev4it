const { datos } = require("../data/datos.js");
//console.log(datos); 

const controller = {
  listado: (req, res) => {
    res.render("personal", { listado: datos.personal });
  },
};

module.exports = controller;
