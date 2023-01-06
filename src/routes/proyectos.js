const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js");
const validationsProyReg = require("../middlewares/validationsProyReg");
const validationsProyUpd = require("../middlewares/validationsProyUpd");

routerProyectos.get("/register", proyectsController.register);

routerProyectos.post("/register", validationsProyReg, proyectsController.store);

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/detail/:id", proyectsController.detail);

routerProyectos.get("/edit/:id", proyectsController.edit);

routerProyectos.get("/softdelete/:id", proyectsController.softdelete);

routerProyectos.patch(
  "/update/:id",
  validationsProyUpd,
  proyectsController.update
);

routerProyectos.delete("/delete/:id", proyectsController.delete);

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;
