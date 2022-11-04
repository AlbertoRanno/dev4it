const express = require("express");
const routerMain = express.Router();
const mainController = require("../controllers/mainController");

routerMain.get("/", mainController.index);

//Middleware
//Permite procesar el cuerpo de la solicitud en formato json
routerMain.use(express.json());

module.exports = routerMain;