const mongoose = require("mongoose");
const { Schema } = mongoose;

const PersonaSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    rol: { type: String },
    password: { type: String },
    seniority: { type: String },
    avatar: { type: String },
    projectInfo: [{ type: String }],
    active: { type: Boolean },
    admin: { type: Boolean },
  },
  { versionKey: false },
  { strict: false }
);

const Persona = mongoose.model("Persona", PersonaSchema);
module.exports = Persona;
