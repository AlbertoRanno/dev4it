const { body } = require("express-validator");
const moment = require("moment");

const validations = [
  body("dateStart").custom((value, { req }) => {
    let fechaInicio = req.body.dateStart;
    let fechaFinal = req.body.dateEnd;

    if (moment(fechaInicio).isAfter(fechaFinal)) {
      throw new Error(
        "La fecha de finalización No puede ser menor a la de inicio"
      );
    }
    return true;
  }),
];

module.exports = validations;
