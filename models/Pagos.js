import mongoose from "mongoose";

const PagosSchema = mongoose.Schema(
  {
    // fechaPagoSuscripcion: { type: Array },
    pagoUnico: {
      montoPagoSuscripcion: { type: Number, required: true },
      notasPagoSuscripcion: { type: String, required: false },
      // fechaPagoSuscripcion: { type: Date, default: new Date() },
      fechaPagoSuscripcion: {},
      metodoPago: { type: String },
    },
    suscriptorPagador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suscriptor",
    },
    suscriptorPagadorNombre: {
      type: String,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

const Pagos = mongoose.model("Pagos", PagosSchema);
export default Pagos;
