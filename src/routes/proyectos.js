const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js")

const {datos} = require("../data/datos.js")

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/:id", proyectsController.detail);

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;