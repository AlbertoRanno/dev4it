const mongoose = require("mongoose")

const personaSchema = mongoose.Schema({
  name: String,
  email: String,
  rol: String,
  password: String,
  proyects: Array,
  seniority: String,
  avatar: String,
}, {versionKey: false}); // Para que no cree el __v:0 en la BD

const PersonalModel = mongoose.model("personas", personaSchema);

module.exports = PersonalModel