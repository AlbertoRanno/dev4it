const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProyectoSchema = new mongoose.Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: Schema.Types.ObjectId, ref: "Persona" },
    condition: { type: String },
    dateStart: { type: Date }, //, default: Date.now, max: "2023-12-31"
    dateEnd: { type: Date }, //, min: Date.now
    involved: [{ type: Schema.Types.ObjectId, ref: "Persona" }],
    link: { type: String },
    observations: { type: String },
    active: { type: Boolean },
  },
  { versionKey: false }
);

const Proyecto = mongoose.model("Proyecto", ProyectoSchema);

module.exports = Proyecto;
