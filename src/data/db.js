const mongoose = require("mongoose");
const url = "mongodb://localhost/dev4it";

const db = mongoose
  .connect(url)
  .then(() => console.log("Conectado a Mongoose"))
  .catch((e) => console.log("El error de conexión es " + e));

  module.exports = db
