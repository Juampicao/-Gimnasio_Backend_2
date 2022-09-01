import express from "express";
import {
  CreateEjercicio,
  GetEjercicioID,
} from "../controllers/EjerciciosController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, GetEjercicioID)
  .post(checkAuth, CreateEjercicio);

// router
//   .route("/pagarsuscripcion/:id")
//   .get(checkAuth, GetPagoSuscripcionId)
//   .put(checkAuth, EditarPagoSuscripcion)
//   .delete(checkAuth, DeletePagoSuscripcion);

export default router;
