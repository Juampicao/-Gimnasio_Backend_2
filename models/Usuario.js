import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    suscripcion: {
      type: String,
      required: true,
      default: "Prueba",
    },
    // tiposSuscripcion: [{}],
    // tiposSuscripcion: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "TipoSuscripcion",
    // },
    tiposSuscripcion: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TipoSuscripcion",
        },
      },
    ],
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hashear. Function normal para this.password.
usuarioSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) {
    next(); // Next indica seguir con el siguiente middleware.
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
