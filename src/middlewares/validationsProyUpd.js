const { body } = require("express-validator");

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
];

module.exports = validations