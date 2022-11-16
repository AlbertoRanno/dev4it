const path = require("path");
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
  body("password")
    .notEmpty()
    .withMessage("La contraseña será necesaria para ingresar a la app")
    .bail() 
    .isLength({ min: 3 })
    .withMessage("La contraseña debe tener al menos 3 caracteres"),
  body("repeatPassword")
    .notEmpty()
    .withMessage("Tienes que repetir la contraseña elegida")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),
];

module.exports = validations;
