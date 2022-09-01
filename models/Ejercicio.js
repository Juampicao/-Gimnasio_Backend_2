import mongoose from "mongoose";
// import Suscriptor from "./suscriptor.js";
import Usuario from "./Usuario.js";

const EjercicioSchema = mongoose.Schema({
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  nombre: { type: String },
  explicacion: { type: String, default: "" },
  // dias: [
  //   "Lunes",
  //   "Martes",
  //   "Miercoles",
  //   "Jueves",
  //   "Viernes",
  //   "Sabado",
  //   "Domingo",
  // ],
});

const Ejercicio = mongoose.model("Ejercicio", EjercicioSchema);
export default Ejercicio;
