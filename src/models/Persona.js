const mongoose = require("mongoose");
const { Schema } = mongoose;

const PersonaSchema = new mongoose.Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    rol: { type: String },
    password: { type: String },
    proyects: [{ type: Schema.Types.ObjectId, ref: "Proyecto" }],
    seniority: { type: String },
    avatar: { type: String },
    active: { type: Boolean },
    admin: { type: Boolean },
  },
  { versionKey: false }
);

const Persona = mongoose.model("Persona", PersonaSchema);
module.exports = Persona;
