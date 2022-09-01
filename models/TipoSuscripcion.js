import mongoose from "mongoose";
import Usuario from "./Usuario.js";

const TipoSuscripcionSchema = mongoose.Schema({
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  nombre: { type: String },
  valor: { type: Number },
});

const TipoSuscripcion = mongoose.model(
  "TipoSuscripcion",
  TipoSuscripcionSchema
);
export default TipoSuscripcion;
