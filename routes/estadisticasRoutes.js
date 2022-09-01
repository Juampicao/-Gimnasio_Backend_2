import express from "express";
import {
  getEstadisticasEstadosSuscriptores,
  getEstadisticasPorFechaPersonalizada,
} from "../controllers/estadisticasController.js";

import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

router
  .route(`/`)
  .get(checkAuth, getEstadisticasEstadosSuscriptores)
  .post(checkAuth);

router
  .route(`/fechapersonalizada`)
  .get(checkAuth, getEstadisticasPorFechaPersonalizada)
  .post(checkAuth);

export default router;
