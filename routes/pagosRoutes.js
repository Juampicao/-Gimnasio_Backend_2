import express from "express";
import {
  pagarSuscripcion,
  DeletePagoSuscripcion,
  EditarPagoSuscripcion,
  GetPagoSuscripcionId,
  GetPagosSuscripcionAllBySuscriptor,
  GetPagosSuscripcionAll,
} from "../controllers/pagosController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/pagarsuscripcion")
  .get(checkAuth, GetPagosSuscripcionAll)
  .post(checkAuth, pagarSuscripcion);

router
  .route("/pagarsuscripcion/:id")
  .get(checkAuth, GetPagoSuscripcionId)
  .put(checkAuth, EditarPagoSuscripcion)
  .delete(checkAuth, DeletePagoSuscripcion);

router
  .route("/pagosporsuscriptor/:suscriptorId")
  .get(checkAuth, GetPagosSuscripcionAllBySuscriptor);

export default router;
