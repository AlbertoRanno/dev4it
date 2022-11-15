const express = require("express");
const routerPersonas = express.Router();
const personalController = require("../controllers/personalController.js");
const uploadFile = require("../middlewares/multer")
const validations = require("../middlewares/validationsPersReg")

routerPersonas.get("/register", personalController.register);

routerPersonas.post(
  "/register",
  uploadFile.single("avatar"),
  validations,
  personalController.store
);

routerPersonas.get("/login", personalController.login)

routerPersonas.use("/search", personalController.search);

routerPersonas.get("/edit/:id", personalController.edit);

routerPersonas.put("/update/:id", personalController.update);

routerPersonas.delete("/delete/:id", personalController.delete);

routerPersonas.get("/:id", personalController.detail);

routerPersonas.get("/", personalController.list);

module.exports = routerPersonas;
