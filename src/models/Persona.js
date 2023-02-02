const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectInfo = new Schema({
  proyect: { type: Schema.Types.ObjectId, ref: "Proyecto" },
  nivel: { type: String },
  porcAsigXContrato: { type: Number },
  porcAsigReal: { type: Number },
  hsMensXContrato: { type: Number },
  hsReales: { type: Number },
  observationsUser: { type: String },
  _id: { type: Schema.Types.ObjectId },
});

const PersonaSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    rol: { type: String },
    password: { type: String },
    seniority: { type: String },
    avatar: { type: String },
    projectsInfo: [projectInfo],
    active: { type: Boolean },
    admin: { type: Boolean },
  },
  { versionKey: false },
  { strict: false }
);

const Persona = mongoose.model("Persona", PersonaSchema);
module.exports = Persona;
