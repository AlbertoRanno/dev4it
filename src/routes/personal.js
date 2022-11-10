const express = require("express");
const routerPersonas = express.Router();
const personalController = require("../controllers/personalController.js");
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/avatars");
  },
  filename: (req, file, cb) => {
    console.log(file);
    let filename = `${Date.now()}_img${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const uploadFile = multer({ storage });
const validations = [
  body("name")
    .notEmpty()
    .withMessage("Estaría bueno que completes el nombre...")
    .bail()
    .isLength({min: 3}).withMessage("Al menos 3 letras..."),
  body("rol").notEmpty().withMessage("Copate y poné el rol"),
  body("seniority").notEmpty().withMessage("Este campo no puede estar vacio"),
  body("email")
    .notEmpty()
    .withMessage("El mail será necesario para que pueda ingresar a la app")
    .bail()
    .isEmail()
    .withMessage("Al menos debe parecer válido..."),
  body("avatar").custom((value, { req }) => {
    let file = req.file;
    let acceptedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (!file) {
      throw new Error("Subí una fotito para el perfil...");
    } else {
      let fileExtension = path.extname(file.originalname);
      if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error(`Las extensiones permitidas son ${acceptedExtensions}`);
      }
    }

    return true;
  }),
];

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

// routerPersonas.get("/", (req, res) => {
//   //Orden descendente para ver primero a los ultimos incorporados a la empresa
//   if (req.query.ordenar == "id") {
//     return res.send(datos.personal.sort((a, b) => b.id - a.id));
//   }
//   res.send(datos.personal);
// });

// routerPersonas.put("/:id", (req, res) => {
//   const personalActualizado = req.body
//   const id = req.params.id

//   const indiceArray = datos.personal.findIndex(persona => persona.id == id)

//   if (indiceArray >= 0) {
//     datos.personal[indiceArray] = personalActualizado;
//   } else {
//     res.status(404).send(`No se encontro a nadie con el id ${id}`);
//   }
//   res.send(datos.personal)
// })

// routerPersonas.patch("/:id", (req, res) => {
//   const infoActualizada = req.body;
//   const id = req.params.id;

//   const indiceArray = datos.personal.findIndex((persona) => persona.id == id);

//   if (indiceArray >= 0) {
//     const personalAModificar = datos.personal[indiceArray];
//     Object.assign(personalAModificar, infoActualizada);
//   } else {
//     res.status(404).send(`No se encontro a nadie con el id ${id}`);
//   }
//   res.send(datos.personal);
// });

// routerPersonas.delete("/:id", (req, res) => {
//   const id = req.params.id
//   const indiceArray = datos.personal.findIndex(persona=> persona.id == id)
//   if(indiceArray>=0){
//     datos.personal.splice(indiceArray,1)
//   } else { res.status(404).send(`No se encontro a nadie con el id ${id}`)}
//   res.send(datos.personal)

// })

module.exports = routerPersonas;
