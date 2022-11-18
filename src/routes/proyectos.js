const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js");
const validations = require("../middlewares/validationsProyReg")

routerProyectos.get("/register", proyectsController.register);

routerProyectos.post("/register", validations, proyectsController.store);

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/detail/:id", proyectsController.detail);

routerProyectos.get("/edit/:id", proyectsController.edit);

routerProyectos.patch("/update/:id", proyectsController.update);

routerProyectos.delete("/delete/:id", proyectsController.delete)

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;
