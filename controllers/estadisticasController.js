import Suscriptor from "../models/Suscriptor.js";
import Pagos from "../models/Pagos.js";

import { hoy } from "../helpers/funciones.js";

const getEstadisticasEstadosSuscriptores = async (req, res) => {
  const { id } = req.params;

  const suscriptoresActivos = await Suscriptor.find({
    $and: [{ creador: req.usuario }, { estado: "Activo" }],
  }).count();

  const suscriptoresDeudores = await Suscriptor.find({
    $and: [{ creador: req.usuario }, { estado: "Deudor" }],
  }).count();

  const suscriptoresTotales = await Suscriptor.find({
    $and: [{ creador: req.usuario }],
  }).count();

  const obtenerMontosTotalesPorMesPorCuota = await Pagos.aggregate([
    {
      $match: {
        $and: [{ creador: req.usuario._id }],
      },
    },
    {
      $group: {
        _id: {
          mes: { $month: "$pagoUnico.fechaPagoSuscripcion" },
        },
        montoPagoSuscripcion: { $sum: "$pagoUnico.montoPagoSuscripcion" },
      },
    },
  ]);

  const obtenerCantidadCuotasPagasPorMes = await Pagos.aggregate([
    {
      $match: {
        $and: [{ creador: req.usuario._id }],
      },
    },
    {
      $group: {
        _id: {
          mes: { $month: "$pagoUnico.fechaPagoSuscripcion" },
        },
        cantidadCuotas: { $sum: 1 },
      },
    },
  ]);

  const obtenerCantidadActivosTipoSuscripcion = await Suscriptor.aggregate([
    {
      $match: {
        $and: [{ creador: req.usuario._id }, { estado: "Activo" }],
      },
    },
    {
      $group: {
        _id: {
          tipoSuscripcion: "$tipoSuscripcion",
        },
        cantidadCuotas: { $sum: 1 },
      },
    },
    // {
    //   $lookup: {
    //     from: "tipoSuscripcion",
    //     localField: "tipoSuscripcion", // field in the suscripcion collection
    //     foreignField: "tipoSuscripcion", // field in the items collection
    //     as: "tipoSuscripcion",
    //   },
    // },
  ]);

  // await Suscriptor.populate(obtenerCantidadActivosTipoSuscripcion, {
  //   path: "tiposSuscripcion._id",
  //   model: "TipoSuscripcion",
  // });

  // console.log(obtenerCantidadActivosTipoSuscripcion);

  try {
    res.json({
      suscriptoresActivos,
      suscriptoresDeudores,
      suscriptoresTotales,
      obtenerMontosTotalesPorMesPorCuota,
      obtenerCantidadCuotasPagasPorMes,
      obtenerCantidadActivosTipoSuscripcion,
    });
  } catch (error) {
    console.log(error);
  }
};

const getEstadisticasPorFechaPersonalizada = async (req, res) => {
  const { fecha } = req.query;

  console.log(fecha.toString());

  // if (fecha.toString() === "Invalid Date") {
  //   console.log("La fecha es invalida...");
  //   res.json("La fecha es invalida");
  //   return;
  // } else {
  //   const nuevaFecha = new Date(fecha).toISOString();
  // }

  const nuevaFecha = new Date(fecha).toISOString();

  let HastaFechaPersonalizada = new Date(fecha);
  let DesdeFechaPersonalizada = new Date();
  DesdeFechaPersonalizada.setDate(HastaFechaPersonalizada.getDate() - 1);

  const obtenerUtilidadVentasHoy = await Pagos.aggregate([
    {
      $match: {
        $and: [
          { creador: req.usuario._id },
          {
            "pagoUnico.fechaPagoSuscripcion": {
              $gte: DesdeFechaPersonalizada,
              $lte: HastaFechaPersonalizada,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "$pagoUnico.metodoPago",
        montoPagoSuscripcion: { $sum: "$pagoUnico.montoPagoSuscripcion" },
        cantidadCuotas: { $sum: 1 },
      },
    },
  ]);
  console.log("Nueva fecha: " + nuevaFecha, obtenerUtilidadVentasHoy);
  res.json({ obtenerUtilidadVentasHoy });
};

// const obtenerCuotasPagadasPorMes = await Suscriptor.aggregate([
//   {
//     $group: {
//       _id: {
//         VencimientoPorMes: { $month: "$fechas.fechaVencimientoSuscripcion" },
//       },
//       count: { $sum: 1 },
//     },
//   },
// ]);

// console.log(obtenerCuotasPagadasPorMes);

// SuscriptoresUnicosActivos.
// Pago de suscripciones del mes.
// Ganancias Bruta del mes (utilidad ingresos - gastos).

export {
  getEstadisticasEstadosSuscriptores,
  getEstadisticasPorFechaPersonalizada,
};
