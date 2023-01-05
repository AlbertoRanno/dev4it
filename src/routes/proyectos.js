const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js");
const validationsReg = require("../middlewares/validationsProyReg")
const validationsUpd = require("../middlewares/validationsProyUpd");

routerProyectos.get("/register", proyectsController.register);

routerProyectos.post("/register", validationsReg, proyectsController.store);

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/detail/:id", proyectsController.detail);

routerProyectos.get("/edit/:id", proyectsController.edit);

routerProyectos.get("/softdelete/:id", proyectsController.softdelete);

routerProyectos.patch("/update/:id", validationsUpd, proyectsController.update);

routerProyectos.delete("/delete/:id", proyectsController.delete)

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;
