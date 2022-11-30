const mongoose = require("mongoose")

const proyectoSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    manager: String,
    condition: String,
    dateStart: { type: Date, default: Date.now },
    dateEnd: Date,
    involved: Array,
    link: String,
  },
  { versionKey: false }
); // Para que no cree el __v:0 en la BD

const ProyectoModel = mongoose.model("proyecto", proyectoSchema);

module.exports = ProyectoModel