const mongoose = require("mongoose")

const personaSchema = mongoose.Schema({
  name: String,
  email: String,
  rol: String,
  password: String,
  proyects: Array,
  seniority: String,
  avatar: String,
});

const PersonalModel = mongoose.model("persona", personaSchema);

module.exports = PersonalModel