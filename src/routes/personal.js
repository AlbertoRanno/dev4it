const express = require("express");
const routerPersonas = express.Router();
const personalController = require("../controllers/personalController.js");
const uploadFile = require("../middlewares/multer");
const validations = require("../middlewares/validationsPersReg");
const guest = require("../middlewares/guest");
const auth = require("../middlewares/auth");

routerPersonas.get("/register", personalController.register);

routerPersonas.post(
  "/register",
  uploadFile.single("avatar"),
  validations,
  personalController.store
);

routerPersonas.get("/login", guest, personalController.login);

routerPersonas.post("/login", personalController.access);

routerPersonas.get("/logout", personalController.logout);

routerPersonas.use("/search", personalController.search);

routerPersonas.get("/edit/:id", personalController.edit);

routerPersonas.patch(
  "/update/:id",
  uploadFile.single("avatar"),
  validations,
  personalController.update
);

routerPersonas.get("/profile/:id", auth, personalController.profile);

routerPersonas.delete("/delete/:id", personalController.delete);

routerPersonas.get("/detail/:id", personalController.detail);

routerPersonas.get("/", personalController.list);

module.exports = routerPersonas;
