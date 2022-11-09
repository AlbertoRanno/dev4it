// const { datos } = require("../data/datos.js")
const fs = require("fs");

let dataJSON = fs.readFileSync("src/data/proyects.json", "utf-8");
let datos = JSON.parse(dataJSON);

const controller = {
  list: (req, res) => {
    res.render("./proyects/proyects", { listado: datos });
  },
  detail: (req, res) => {
    const id = req.params.id;
    const resultados = datos.filter((proyecto) => proyecto.id == id);
    console.log(resultados);

    if (resultados.length === 0) {
      return res
        .status(404)
        .send(`No se encontro ningun proyecto con el id ${id}`);
    }

    res.send(resultados);
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
};

module.exports = controller