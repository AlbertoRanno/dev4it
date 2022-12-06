const mongoose = require("mongoose");
const { Schema } = mongoose;

const personaSchema = Schema(
  {
    //_id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    rol: { type: String },
    password: { type: String },
    proyects: [{ type: Schema.Types.ObjectId, ref: "Proyecto" }],
    seniority: { type: String },
    avatar: { type: String },
  },
  { versionKey: false }
);

const Persona = mongoose.model("persona", personaSchema);
module.exports = Persona;
