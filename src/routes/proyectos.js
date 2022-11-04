const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js")

const {datos} = require("../data/datos.js")

routerProyectos.get("/", proyectsController.listado);

routerProyectos.get("/:id", (req, res) => {
  const id = req.params.id;
  const resultados = datos.proyectos.filter((proyecto) => proyecto.id == id);
  console.log(resultados);

  if (resultados.length === 0) {
    return res
      .status(404)
      .send(`No se encontro ningun proyecto con el id ${id}`);
  }

  res.send(resultados);
});

module.exports = routerProyectos;