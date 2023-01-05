const { body } = require("express-validator");
const moment = require("moment");

const validations = [
  body("name")
    .notEmpty()
    .withMessage("Estaría bueno que completes el nombre...")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Al menos 3 letras..."),
  body("description")
    .notEmpty()
    .withMessage("Una breve descripción será útil..."),
  body("dateStart").custom((value, { req }) => {
    let fechaInicio = req.body.dateStart;
    let fechaFinal = req.body.dateEnd;

    if (moment(fechaInicio).isAfter(fechaFinal)) {
      console.log("La fecha de finalización No puede ser menor a la de inicio");
      throw new Error(
        "La fecha de finalización No puede ser menor a la de inicio"
      );
    }
    return true;
  }),

  body("dateEnd").custom((value, { req }) => {
    let fechaInicio = req.body.dateStart;
    let fechaFinal = req.body.dateEnd;

    if (moment(fechaFinal).isAfter(moment())) {
      console.log(moment());
      throw new Error("El proyecto debe");
    }
    return true;
  }),
];

module.exports = validations;
