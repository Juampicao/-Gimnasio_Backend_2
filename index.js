import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import suscriptoreRoutes from "./routes/suscriptoresRoutes.js";
import estadisticasRoutes from "./routes/estadisticasRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import ejercicsioRoutes from "./routes/ejerciciosRoutes.js";

import Suscriptor from "./models/Suscriptor.js";
import Usuario from "./models/Usuario.js";
import TipoSuscripcion from "./models/TipoSuscripcion.js";
// import { verificarEstadoDeDeudas } from "./helpers/funciones.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

console.log(`La variable de entorno es ${process.env.FRONTEND_URL}`);

// Configurar CORS
// Borrar la ruta y dejar el process.env
// const whitelist = [process.env.FRONTEND_URL];
const whitelist = "https://gestionatugimnasio2.netlify.app";

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Esta URL no esta permitida."));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use(`/usuarios`, usuarioRoutes);
app.use(`/suscriptores`, suscriptoreRoutes);
app.use(`/estadisticas`, estadisticasRoutes);
app.use(`/pagos`, pagosRoutes);
app.use(`/ejericicios`, ejercicsioRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Servidor Corriendo en el puerto 4000");
});
