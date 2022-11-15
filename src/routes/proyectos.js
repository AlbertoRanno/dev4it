const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js");
const { body } = require("express-validator");

const validations = [
  body("name")
    .notEmpty()
    .withMessage("Estaría bueno que completes el nombre...")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Al menos 3 letras..."),
  body("description").notEmpty().withMessage("Una breve descripción será útil..."),
  
];

routerProyectos.get("/register", proyectsController.register);

routerProyectos.post("/register", validations, proyectsController.store);

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/:id", proyectsController.detail);

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;
