import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  validarToken,
  nuevoPassword,
  perfil,
  postTiposSuscripcion,
  obtenerTiposSuscripcion,
  editarTiposSuscripcion,
  eliminarTiposSuscripcion,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Autenticacion, Registro y confirmacion de usuarios.
router.post("/", registrar);
router.post(`/login`, autenticar);
router.get(`/confirmar/:token`, confirmar);
router.post(`/olvide-password`, olvidePassword);
router.route(`/olvide-password/:token`).get(validarToken).post(nuevoPassword); // Si es get, validarToken, si es POST, nuevoPassword.
router
  .route(`/tipossuscripcion`)
  .post(checkAuth, postTiposSuscripcion)
  .get(checkAuth, obtenerTiposSuscripcion)
  .put(checkAuth, editarTiposSuscripcion)
  .delete(checkAuth, eliminarTiposSuscripcion);

router.get(`/perfil`, checkAuth, perfil); // Con next(), va a perfil. Sino, no.

export default router;
