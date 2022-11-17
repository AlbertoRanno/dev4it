const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js");
const validations = require("../middlewares/validationsProyReg")

routerProyectos.get("/register", proyectsController.register);

routerProyectos.post("/register", validations, proyectsController.store);

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/detail/:id", proyectsController.detail);

routerProyectos.delete("/delete/:id", proyectsController.delete)

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;
