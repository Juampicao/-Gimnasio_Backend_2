import mongoose from "mongoose";
// import { generarNumeroSocio } from "../helpers/funciones";
import Ejercicio from "./Ejercicio.js";

const SuscriptorSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    socio: {
      type: Number,
      required: true,
      unique: true,
    },
    estado: {
      type: String,
      required: true,
      default: "Deudor",
    },
    informacionPersonal: {
      imagen: {},
      domicilio: { type: String },
      dni: { type: Number },
      celular: { type: Number },
      correo: {},
      genero: {},
      fechaNacimiento: {},
      notas: {},
    },
    // tipoSuscripcion: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   default: "Estandar",
    // },
    tipoSuscripcion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TipoSuscripcion",
    },
    fechas: {
      fechaAlta: {
        type: Date,
        default: new Date(),
      },
      fechaVencimientoSuscripcion: {
        type: Date,
        default: new Date(),
      },
    },
    rutina: [
      {
        ejercicio: { type: mongoose.Schema.Types.ObjectId, ref: "Ejercicio" },
        nombreEjercicio: "",
        repeticiones: "",
        series: "",
        dias: "",
      },
    ],
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    pagos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pagos",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Suscriptor;
if (mongoose.models.Suscriptor) {
  Suscriptor = mongoose.model("Suscriptor");
} else {
  Suscriptor = mongoose.model("Suscriptor", SuscriptorSchema);
}

export default Suscriptor;
// const Suscriptor = mongoose.model("Suscriptor", SuscriptorSchema);
