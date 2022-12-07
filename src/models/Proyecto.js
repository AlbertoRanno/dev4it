const mongoose = require("mongoose")
const { Schema } = mongoose;

const ProyectoSchema = new mongoose.Schema(
  {
   _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: String },
    condition: { type: String },
    dateStart: { type: Date, default: Date.now },
    dateEnd: { type: Date },
    involved: [{ type: Schema.Types.ObjectId, ref: "Persona" }],
    link: { type: String },
  },
  { versionKey: false }
);


const Proyecto = mongoose.model("Proyecto", ProyectoSchema)

module.exports = Proyecto
