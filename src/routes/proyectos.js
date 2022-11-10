const express = require("express");
const routerProyectos = express.Router();
const proyectsController = require("../controllers/proyectsController.js")
const { body } = require("express-validator");

const validations = [
  body("name")
    .notEmpty()
    .withMessage("Estaría bueno que completes el nombre...")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Al menos 3 letras..."),
  body("rol").notEmpty().withMessage("Copate y poné el rol"),
  body("seniority").notEmpty().withMessage("Este campo no puede estar vacio"),
  body("email")
    .notEmpty()
    .withMessage("El mail será necesario para que pueda ingresar a la app")
    .bail()
    .isEmail()
    .withMessage("Al menos debe parecer válido..."),
];

routerProyectos.get("/register", proyectsController.register)

routerProyectos.post("/register", validations, proyectsController.store)

routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/:id", proyectsController.detail);

routerProyectos.get("/", proyectsController.list);

module.exports = routerProyectos;