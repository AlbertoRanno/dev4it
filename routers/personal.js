const express = require("express");
const routerPersonas = express.Router();

const { datos } = require("../data/datos.js")

routerPersonas.get("/", (req, res) => {
  //Orden descendente para ver primero a los ultimos incorporados a la empresa
  if (req.query.ordenar == "id") {
    return res.send(datos.personal.sort((a, b) => b.id - a.id));
  }

  res.send(datos.personal);
});

routerPersonas.get("/:id", (req, res) => {
  const id = req.params.id;
  const resultados = datos.personal.filter((persona) => persona.id == id);

  if (resultados.length === 0) {
    return res.status(404).send(`No se encontro a nadie con el id ${id}`);
  }

  res.send(resultados);
});

module.exports = routerPersonas;