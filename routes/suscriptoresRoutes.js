import express from "express";
// import { verificarEstadoDeDeudas } from "../helpers/funciones.js";

import {
  obtenerSuscriptores,
  obtenerSuscriptorId,
  obtenerSuscriptorBySocio,
  crearSuscriptor,
  editarSuscriptorId,
  eliminarSuscriptorId,
  PostEjercicioDeRutina,
  editarRutina,
  verificarEstadoDeDeudas,
  EliminarEjercicioDeRutina,
} from "../controllers/suscriptoresController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route(`/`)
  .get(checkAuth, obtenerSuscriptores)

  .post(checkAuth, crearSuscriptor);

router
  .route("/:id")
  .get(checkAuth, obtenerSuscriptorId)
  .put(checkAuth, editarSuscriptorId)
  .delete(checkAuth, eliminarSuscriptorId);

router
  .route("/rutina/:id")
  .get(checkAuth)
  .post(checkAuth, PostEjercicioDeRutina);
router
  .route("/rutina/:id")
  .put(checkAuth, editarRutina)
  .delete(checkAuth, EliminarEjercicioDeRutina);

router
  .route("/obtenersuscriptorporsocio")
  .get(checkAuth, obtenerSuscriptorBySocio);

router.route("/verificar/estadodeuda").get(checkAuth, verificarEstadoDeDeudas);

export default router;
